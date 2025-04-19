package handlers

import (
	"database/sql"
	"encoding/json"
	"html"
	"net/http"
	"strings"

	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
)

func CommentHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Metohde Not allowed.")
	}
	var comment database.Comment
	json.NewDecoder(r.Body).Decode(&comment)
	if comment.Content == "" {
		utils.SendError(w, http.StatusBadRequest, "Cannot send empty comment.")
	}
	comment.Content = html.EscapeString(strings.TrimSpace(comment.Content))

	err := models.Comment(comment.IdPost, comment.IdUser, comment.Date, comment.Content, db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
	}
}
