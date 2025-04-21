package models

import (
	"database/sql"
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
	expired := time.Now().Add(24 * time.Hour)
	query := `
	INSERT INTO session (ID_User, token, Expired_At)
	VALUES (?, ?, ?)
	ON CONFLICT(ID_User)
	DO UPDATE SET token = EXCLUDED.token, Expired_At = ?
`
	stm, err := db.Prepare(query)
	if err != nil {
		return err
	}
	defer stm.Close()
	_, err = stm.Exec(id, token, expired, expired)
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
