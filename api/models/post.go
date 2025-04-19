package models

import (
	"database/sql"
)

func CreatePost(title string, content string, create_at int, userId int, db *sql.DB) (int, error) {
	query := "INSERT INTO posts (Title, User_id, Content, Create_at) VALUES (?, ?, ? , ?)"
	stm1, err := db.Prepare(query)
	if err != nil {
		return 0, err
	}
	defer stm1.Close()

	res, err := stm1.Exec(title, userId, content, create_at)
	if err != nil {
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}
