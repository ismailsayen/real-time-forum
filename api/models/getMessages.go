package models

import (
	"database/sql"

	"rtFroum/database"
)

func GetMessages(user1_id, user2_id int, db *sql.DB) ([]database.ChatMessage, error) {
	query := `SELECT m.ID, u1.Nickname, u2.Nickname, m.Content, m.Sent_At 
			FROM Messages m 
			INNER JOIN users u1 ON m.Sender_ID=u1.ID
			INNER JOIN users u2 ON m.Receiver_ID=u2.ID
			WHERE (m.Receiver_ID=? AND m.Sender_ID=? ) OR (m.Receiver_ID=? AND m.Sender_ID=?)
			ORDER BY m.Sent_At DESC
			`
	rows, err := db.Query(query, user1_id, user2_id, user2_id, user1_id)
	if err != nil && err != sql.ErrNoRows {
		return nil, err
	}
	defer rows.Close()
	var messages []database.ChatMessage
	for rows.Next() {
		var msg database.ChatMessage
		err = rows.Scan(&msg.ID, &msg.SenderNickname, &msg.ReceiverNickname, &msg.Content, &msg.SentAt)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}
