package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"

	"rtFroum/api/models"
	"rtFroum/utils"
)

func GetUsers(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodGet {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	ID := r.Context().Value("userId").(int)
	users, err := models.FetchUsers(db, ID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch users")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(users)
}
