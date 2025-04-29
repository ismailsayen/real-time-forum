package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"rtFroum/api/models"
	"rtFroum/utils"
)

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

// func SendMessage(w http.ResponseWriter, r *http.Request, db *sql.DB) {
// 	if r.Method != http.MethodPost {
// 		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
// 		return
// 	}

// 	var request struct {
// 		SenderID   int    `json:"senderId"`
// 		ReceiverID int    `json:"receiverId"`
// 		Content    string `json:"content"`
// 	}

// 	if err := json.NewDecoder(r.Body).Decode(&request); err != nil {
// 		utils.SendError(w, http.StatusBadRequest, "Invalid Request Body")
// 		return
// 	}

// 	chatID, err := getOrCreateChat(db, request.SenderID, request.ReceiverID)
// 	if err != nil {
// 		utils.SendError(w, http.StatusInternalServerError, "Failed to get or create chat")
// 		return
// 	}

// 	message := database.ChatMessage{
// 		ConversationID: chatID,
// 		Sender:         request.SenderID,
// 		Content:        request.Content,
// 		SentAt:         int(time.Now().Unix()),
// 	}

// 	messageID, err := models.InsertMessage(db, message)
// 	if err != nil {
// 		utils.SendError(w, http.StatusInternalServerError, "Failed to send message")
// 		return
// 	}

// 	response := map[string]interface{}{
// 		"id":       messageID,
// 		"content":  request.Content,
// 		"sent_at":  time.Now().Format(time.RFC3339),
// 		"senderId": request.SenderID,
// 	}

// 	w.Header().Set("Content-Type", "application/json")
// 	json.NewEncoder(w).Encode(response)
// }

// func getOrCreateChat(db *sql.DB, senderID, receiverID int) (int64, error) {
// 	var chatID int64
// 	query := `
// 	SELECT ID FROM Chat
// 	WHERE (User1_ID = ? AND User2_ID = ?) OR (User1_ID = ? AND User2_ID = ?)
// 	`
// 	err := db.QueryRow(query, senderID, receiverID, receiverID, senderID).Scan(&chatID)
// 	if err == nil {
// 		return chatID, nil
// 	}

// 	query = `
// 	INSERT INTO Chat (User1_ID, User2_ID, Created_At)
// 	VALUES (?, ?, ?)
// 	`
// 	result, err := db.Exec(query, senderID, receiverID, time.Now().Unix())
// 	if err != nil {
// 		return 0, err
// 	}

// 	chatID, err = result.LastInsertId()
// 	if err != nil {
// 		return 0, err
// 	}

// 	return int64(chatID), nil
// }
