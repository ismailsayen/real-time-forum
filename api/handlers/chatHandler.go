package handlers

import (
	"database/sql"
	"encoding/json"
	"net/http"
	"rtFroum/api/models"
	"rtFroum/utils"
	"strconv"
)

func GetMessages(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodGet {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}

	convIDStr := r.URL.Query().Get("chat_id")
	convID, err := strconv.Atoi(convIDStr)
	if err != nil || convID <= 0 {
		utils.SendError(w, http.StatusBadRequest, "Invalid conversation ID")
		return
	}

	messages, err := models.GetChat(db, convID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Failed to fetch messages")
		return
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(messages)
}
