package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
	"time"
)

func GetMessages(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	type User2 struct {
		ReceiverID int `json:"receiverId"`
	}
	user1ID := r.Context().Value("userId").(int)

	if r.Body == nil {
		fmt.Println("body")
		utils.SendError(w, http.StatusBadRequest, "Empty request body")
		return
	}
	var user2 User2
	if err := json.NewDecoder(r.Body).Decode(&user2); err != nil {
		fmt.Println("decode")

		utils.SendError(w, http.StatusBadRequest, "Invalid json format data")
		return
	}
	fmt.Println(user1ID, user2.ReceiverID)

	chatID, err := models.GetChatID(db, user1ID, user2.ReceiverID)
	if err != nil {
		fmt.Println("dd")
		utils.SendError(w, http.StatusInternalServerError, "there is no chat yet ")
		return
	}

	messages, err := models.GetMessagesByChatID(db, chatID)
	if err != nil {
		fmt.Println("getmessageby  ")

		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch messages")
		return
	}
	fmt.Println("dd", messages)

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}
func GetUsers(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodGet {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	ID := r.Context().Value("userId").(int)
	users, err := models.FetchUsers(db, ID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}

func SendMessage(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	var request struct {
		ReceiverID int    `json:"receiverId"`
		Content    string `json:"content"`
	}

	SenderID := r.Context().Value("userId").(int)

	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid Request Body")
		return
	}

	chatID, err := getOrCreateChat(db, SenderID, request.ReceiverID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to get or create chat")
		return
	}

	message := database.ChatMessage{
		ConversationID: chatID,
		Sender:         SenderID,
		Content:        request.Content,
		SentAt:         int(time.Now().Unix()),
	}

	messageID, err := models.InsertMessage(db, message)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to send message")
		return
	}

	response := map[string]interface{}{
		"id":       messageID,
		"content":  request.Content,
		"sent_at":  time.Now().Format(time.RFC3339),
		"senderId": SenderID,
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func getOrCreateChat(db *sql.DB, senderID, receiverID int) (int64, error) {

	var chatID int64
	query := `
	SELECT ID FROM Chat
	WHERE (User1_ID = ? AND User2_ID = ?) OR (User1_ID = ? AND User2_ID = ?)
	`
	err := db.QueryRow(query, senderID, receiverID, receiverID, senderID).Scan(&chatID)
	if err == nil {

		return chatID, nil
	}

	query = `
	INSERT INTO Chat (User1_ID, User2_ID, Created_At)
	VALUES (?, ?, ?)
	`
	result, err := db.Exec(query, senderID, receiverID, time.Now().Unix())
	if err != nil {
		return 0, err
	}

	chatID, err = result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int64(chatID), nil
}
