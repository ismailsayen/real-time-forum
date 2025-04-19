package models

import (
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"rtFroum/utils"

	"github.com/gofrs/uuid"
)

func CreateSession(w http.ResponseWriter, id int, db *sql.DB) error {
	token, err := uuid.NewV4()
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "cant generate new token for session")
		return err
	}
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
	expired := time.Now().Add((24 * time.Hour))
	_, err = stm.Exec(id, token, expired)
	if err != nil {
		return err
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token.String(),
		HttpOnly: true,
		Expires:  expired,
	})
	return nil
}
