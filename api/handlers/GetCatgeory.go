package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"rtFroum/api/models"
	"rtFroum/utils"
)

func GetCategory(w http.ResponseWriter, r *http.Request, db *sql.DB) {

	if r.Method != http.MethodGet {
		utils.SendError(w, http.StatusMethodNotAllowed, "Methode Not Allowed")
		return
	}
	categories, err := models.DisplayCategory(db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Cannot Fetch Category")
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(categories)

}
