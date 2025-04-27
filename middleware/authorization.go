package middleware

import (
	"context"
	"database/sql"
	"fmt"
	"net/http"
	"time"

	"rtFroum/utils"
)

func Authorization(next http.Handler, db *sql.DB) http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		cookie, err := r.Cookie("token")
		if err != nil {
			utils.SendError(w, http.StatusForbidden, "you need to login.")
			return
		}

		var userId int
		var nickname string
		var expired time.Time
		query := `SELECT u.ID, u.Nickname, s.Expired_At 
		FROM users u
		JOIN Session s ON s.ID_User = u.ID
		WHERE s.token = ?;
	`
	err = db.QueryRow(query, cookie.Value).Scan(&userId, &nickname, &expired)
	if err != nil {
		fmt.Println(" error:", err)
		utils.SendError(w, http.StatusForbidden, "you need to login.")
		return
	}

		if time.Now().UTC().After(expired.UTC()) {
			db.Exec("UPDATE users set Session=? WHERE ID=?", "", userId)
			utils.SendError(w, http.StatusForbidden, "you need to login.")
			return
		}

		ctx := context.WithValue(r.Context(), "userId", userId)
		ctx = context.WithValue(ctx, "nickname", nickname)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
