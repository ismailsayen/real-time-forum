package models

import (
	"database/sql"
	"fmt"
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
		var nickname string
		err := rows.Scan(&msg.ID, &msg.ConversationID, &msg.Sender, &msg.Content, &msg.SentAt, &nickname)

		if err != nil {
			return nil, err
		}
		messages = append(messages, msg)
	}
	return messages, nil
}

func InsertMessage(db *sql.DB, message database.ChatMessage) (int, error) {
	query := `
	INSERT INTO Messages (Chat_ID, Sender_ID, Content, Sent_At)
	VALUES (?, ?, ?, ?)
	`
	result, err := db.Exec(query, message.ConversationID, message.Sender, message.Content, message.SentAt)
	if err != nil {
		return 0, err
	}

	messageID, err := result.LastInsertId()
	if err != nil {
		return 0, err
	}

	return int(messageID), nil
}

func GetChatID(db *sql.DB, user1ID, user2ID int) (int, error) {
	query := `
		SELECT ID FROM Chat
		WHERE (User1_ID = ? AND User2_ID = ?) OR (User1_ID = ? AND User2_ID = ?)
		LIMIT 1;
	`

	var chatID int
	err := db.QueryRow(query, user1ID, user2ID, user2ID, user1ID).Scan(&chatID)
	if err != nil {
		return 0, fmt.Errorf("failed to get chat ID: %v", err)
	}

	return chatID, nil
}

// GetMessagesByChatID retrieves the messages for a given chat ID
func GetMessagesByChatID(db *sql.DB, chatID int) ([]database.ChatMessage, error) {
	query := `
		SELECT m.ID, m.Chat_ID, m.Sender_id, m.Content, m.Sent_at, u.Nickname
		FROM Messages m
		INNER JOIN Users u ON u.ID = m.Sender_id
		WHERE m.Chat_ID = ?
		ORDER BY m.Sent_at ASC;
	`

	rows, err := db.Query(query, chatID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []database.ChatMessage
	for rows.Next() {
		var msg database.ChatMessage
		var nickname string
		err := rows.Scan(&msg.ID, &msg.ConversationID, &msg.Sender, &msg.Content, &msg.SentAt, &nickname)
		if err != nil {
			return nil, err
		}
		msg.SenderNickname = nickname
		messages = append(messages, msg)
	}
	return messages, nil
}
