package middleware

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"time"

	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
)

func VerifyCookie(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	cookie, err := r.Cookie("token")
	if err != nil {
		utils.SendError(w, http.StatusForbidden, "You need to login/register")
		return
	}
	var userId int
	var expired time.Time
	err = db.QueryRow("SELECT ID_User, Expired_At FROM Session WHERE token=?", cookie.Value).Scan(&userId, &expired)
	if err != nil {
		utils.SendError(w, http.StatusForbidden, "Invalid session")
		return
	}

	if time.Now().UTC().After(expired.UTC()) {
		db.Exec("UPDATE Session set token=? WHERE token=?", "", cookie.Value)
		utils.SendError(w, http.StatusForbidden, "Session Expired, you need to login/register")
		return
	}
	_, nickname, err := models.GetUserId(r, db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	user := database.User{
		NickName: nickname,
	}

	w.Header().Set("Content-Type", "application/json")
	err = json.NewEncoder(w).Encode(user)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to encode user data")
	}
}
