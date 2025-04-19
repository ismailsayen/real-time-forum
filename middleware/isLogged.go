package middleware

import (
	"database/sql"
	"net/http"

	"time"

	"rtFroum/utils"
)

func VerifyCookie(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	cookie, err := r.Cookie("Token")
	if err != nil {
		utils.SendError(w, http.StatusForbidden, "You need to login/register")
		return
	}
	exist := ""
	var expired time.Time
	db.QueryRow("SELECT token, Expired_At FROM Session WHERE token=?", cookie.Value).Scan(&exist, &expired)
	if exist == "" {
		utils.SendError(w, http.StatusForbidden, "You need to login/register")
		return
	}

	if time.Now().UTC().After(expired.UTC()) {
		db.Exec("UPDATE Session set Session=? WHERE Session=?", "", exist)
		utils.SendError(w, http.StatusForbidden, "Session Expired, you need to need to login/register")
		return
	}

}
