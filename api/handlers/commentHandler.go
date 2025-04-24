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
		return
	}
	ID := r.Context().Value("userId").(int)
	var comment database.Comment
	json.NewDecoder(r.Body).Decode(&comment)
	if comment.Content == "" {
		utils.SendError(w, http.StatusBadRequest, "Cannot send empty comment.")
		return
	}
	comment.Content = html.EscapeString(strings.TrimSpace(comment.Content))
	comment.IdUser = ID
	err := models.Comment(comment.IdPost, comment.IdUser, comment.Date, comment.Content, db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
}


func FetchComment(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Metohde Not allowed.")
		return
	}
	var post database.Posts

	json.NewDecoder(r.Body).Decode(&post)
	
	comments,err:=models.GetComment(w,r,db,post.ID)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(comments)
}



