package models

import (
	"database/sql"
	"errors"

	"golang.org/x/crypto/bcrypt"
)

func ValidPass(id int, password string, db *sql.DB) error {
	query := `SELECT password FROM users where id=?`
	hashedPass := ""
	err := db.QueryRow(query, id).Scan(&hashedPass)
	if err != nil {
		return err
	}
	err = bcrypt.CompareHashAndPassword([]byte(hashedPass), []byte(password))
	if err != nil {
		return errors.New("unmatched")
	}
	return nil
}
