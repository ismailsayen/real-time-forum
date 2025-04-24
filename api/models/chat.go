package models

import (
	"database/sql"
	"rtFroum/database"
)

func GetChat(db *sql.DB, convID int) ([]database.ChatMessage, error) {
	query := `
	SELECT m.ID, m.Chat_ID, m.Sender_id, m.Content, m.Sent_at, u.Nickname
	FROM Messages m
	INNER JOIN Users u ON u.ID = m.Sender_id
	WHERE m.Chat_ID = ?
	ORDER BY m.Sent_at ASC;
	`

	rows, err := db.Query(query, convID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []database.ChatMessage
	for rows.Next() {
		var msg database.ChatMessage
		err := rows.Scan(&msg.ID, &msg.ConversationID, &msg.Sender, &msg.Content, &msg.SentAt,)
		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}
