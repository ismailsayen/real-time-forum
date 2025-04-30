package models

import (
	"database/sql"
	"fmt"

	"rtFroum/database"
)

func GetMessages(user1_id, user2_id int, chatID int64, db *sql.DB) (map[string]interface{}, error) {
	query := `SELECT 
				m.ID, 
				u.Nickname , 
				m.Content, 
				m.Sent_At 
			FROM Messages m 
			INNER JOIN users u ON m.Reciever_ID = u.ID 
			WHERE m.Chat_ID = ? 
			ORDER BY m.Sent_At DESC;
			`
	rows, err := db.Query(query, chatID)
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
	_, err := db.Exec(query, senderID, receiverID, message, date, chatID)
	if err != nil {
		fmt.Println(err, "SS")
		return nil, err
	}
	messageSent := map[string]interface{}{
		"type":    "messageSent",
		"sender":  sender,
		"message": message,
		"date":    date,
		"ChatID":  chatID,
	}
	return messageSent, nil
}
