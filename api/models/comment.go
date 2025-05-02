package models

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"rtFroum/database"
)

func Comment(post, user, date int, content string, db *sql.DB) error {
	query := `INSERT INTO COMMENT (ID, Content, DateCreation,ID_User,ID_Post) 
	VALUES (?,?, ?, ?, ?) `
	stm, err := db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stm.Exec(nil, content, date, user, post)
	if err != nil {
		return err
	}
	defer stm.Close()
	return nil
}

func GetComment(w http.ResponseWriter, r *http.Request, db *sql.DB, postId int) ([]database.Comment, error) {
	query := `
       SELECT c.ID , c.Content , u.Nickname , c.DateCreation
       FROM comment c
       JOIN posts p ON p.ID = c.ID_Post
       JOIN users u ON u.ID = c.ID_User
       WHERE ID_Post = ?
	   ORDER BY c.DateCreation DESC;
    
	`
	rows, err := db.Query(query, postId)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var comments []database.Comment
	for rows.Next() {

		var c database.Comment
		if err := rows.Scan(&c.Id, &c.Content, &c.NickName, &c.Date); err != nil {
			return nil, err
		}
		comments = append(comments, c)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return comments, nil
}

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
