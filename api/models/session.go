package models

import (
	"database/sql"
	"fmt"
	"time"
)

func CreateSession(id int, token string, expired time.Time, db *sql.DB) error {
	query := `
	INSERT INTO session (ID_User, token, Expired_At) 
	VALUES (?, ?, ?) 
	ON CONFLICT DO UPDATE SET token = EXCLUDED.token , expired_at = CURRENT_TIMESTAMP
	`
	stm, err := db.Prepare(query)
	if err != nil {
		fmt.Println(err)
		return err
	}
	defer stm.Close()
	_, err = stm.Exec(id, token, expired)
	if err != nil {
		fmt.Println(err)
		return err
	}
	return nil
}
