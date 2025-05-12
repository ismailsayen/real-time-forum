package models

import (
	"database/sql"
	"fmt"
	"time"

	"rtFroum/database"
)

func GetOrCreateChat(db *sql.DB, senderID, receiverID int) (int64, error) {
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
		fmt.Println("erro chat")
		return 0, err
	}

	chatID, err = result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int64(chatID), nil
}

func GetMessages(user1_id, user2_id int, chatID int64, offset int, limit int, db *sql.DB) (map[string]interface{}, error) {
	query := `SELECT 
				m.ID, 
				u.Nickname , 
				m.Content, 
				m.Sent_At 
			FROM Messages m 
			INNER JOIN users u ON m.Reciever_ID = u.ID 
			WHERE m.Chat_ID = ? 
			ORDER BY m.Sent_At desc
			LIMIT ? OFFSET ?;
			`
	rows, err := db.Query(query, chatID, limit, offset)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()
	var messages []database.ChatMessage
	for rows.Next() {
		var msg database.ChatMessage
		err = rows.Scan(&msg.ID, &msg.ReceiverNickname, &msg.Content, &msg.SentAt)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	data := map[string]interface{}{
		"type":         "conversation",
		"conversation": messages,
		"chatID":       chatID,
	}
	return data, nil
}
func SendMessage(message, sender string, senderID, receiverID, date, chatID int, db *sql.DB) (map[string]interface{}, error) {
	query := `INSERT INTO Messages (Sender_ID, Reciever_ID,Content,Sent_At,Chat_ID)
	VALUES (?, ?, ?, ?, ?)`
	result, err := db.Exec(query, senderID, receiverID, message, date, chatID)
	if err != nil {
		return nil, err
	}
	messageId, err := result.LastInsertId()
	if err != nil {
		return nil, err
	}
	messageSent := map[string]interface{}{
		"type":    "messageSent",
		"sender":  sender,
		"message": message,
		"date":    date,
		"ChatID":  chatID,
		"messageId": messageId,
	}
	return messageSent, nil
}

func LastUsersMessaged(db *sql.DB, id int) (map[string]interface{}, error) {

	query := `SELECT u.ID, u.Nickname,
		(
			SELECT MAX(m.Sent_At)
			FROM Messages m
			WHERE (m.Sender_ID = ? AND m.Reciever_ID = u.ID)
			   OR (m.Reciever_ID = ? AND m.Sender_ID = u.ID)
		) AS lastAt
	FROM Users u
	WHERE u.ID <> ?
	ORDER BY lastAt DESC, u.Nickname ASC;
	`
	row, err := db.Query(query, id, id, id)
	if err != nil {
		return nil, err
	}
	defer row.Close()
	var users []database.User
	for row.Next() {
		var u database.User
		err := row.Scan(&u.ID, &u.NickName, &u.Last)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	latestUser := map[string]interface{}{
		"type": "LAstusersChatted",
		"users": users,
	}
	return latestUser, nil

}
