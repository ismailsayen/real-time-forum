package models

import "database/sql"

func Comment(post, user, date int, content string, db *sql.DB) error {
	query := `INSERT INTO COMMENT (ID, Content, DateCreation,ID_User,ID_Post) 
	VALUES (?,?, ?, ?, ?) `
	stm, err := db.Prepare(query)
	if err != nil {
		return err
	}
	_, err = stm.Exec(nil,content, date, user, post)
	if err != nil {
		return err
	}
	defer stm.Close()
	return nil
}
