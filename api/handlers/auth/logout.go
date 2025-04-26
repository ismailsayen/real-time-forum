package auth

import (
	"database/sql"
	"net/http"

	"rtFroum/utils"
)

func LogoutController(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	cookies, err := r.Cookie("token")
	if err != nil || cookies.Value == "" {
		utils.SendError(w, http.StatusForbidden, "the user not Logged In")
		return
	}
	delete(cookies.Value, db, w)
	http.SetCookie(w, &http.Cookie{
		Value:  "",
		Name:   "token",
		MaxAge: -1,
	})
}

func delete(token string, db *sql.DB, w http.ResponseWriter) {
	query := "DELETE FROM session WHERE token = ?"
	_, err := db.Exec(query, token)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Error in Deleting session ")
		return
	}
}
