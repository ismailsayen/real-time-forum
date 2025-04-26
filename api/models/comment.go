package models

import (
	"database/sql"
	"net/http"

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
