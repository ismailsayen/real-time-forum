package handlers

import (
	"database/sql"
	"encoding/json"
	"html"
	"net/http"
	"strconv"
	"strings"

	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
)

func PostHundler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodGet {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	posts, err := models.GetPosts(db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, "Cannot Fetch Post")
		return
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(posts)
}

func AddPost(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	var post database.Posts
	ID := r.Context().Value("userId").(int)

	if r.Body == nil {
		utils.SendError(w, http.StatusBadRequest, "Empty request body")
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&post); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid json format data")
		return
	}
	validCategoryIDs := map[string]bool{
		"1": true,
		"2": true,
		"3": true,
		"4": true,
		"5": true,
		"6": true,
		"7": true,
	}
	for _, catID := range post.Categories {
		if !validCategoryIDs[strings.TrimSpace(catID)] {
			utils.SendError(w, http.StatusBadRequest, "Invalid category")
			return
		}
	}
	if strings.TrimSpace(post.Title) == "" || len(post.Categories) == 0 || strings.TrimSpace(post.Content) == "" {
		utils.SendError(w, http.StatusBadRequest, "Title or Content or Categorie field's  empty ")
		return
	} else if len(post.Content) > 10000 || len(post.Title) > 255 {
		utils.SendError(w, http.StatusBadRequest, " Title or Content field's too large")
		return
	}

	post.Content = html.EscapeString(post.Content)
	post.Title = html.EscapeString(post.Title)
	post.UserID = ID
	idPost, err := models.CreatePost(post.Title, post.Content, post.CreatedAt, post.UserID, db)
	if err != nil {
		utils.SendError(w, http.StatusBadRequest, "Cannot create post")
		return
	}

	for _, c := range post.Categories {
		catId, err := strconv.Atoi(c)
		if err != nil {
			utils.SendError(w, http.StatusBadRequest, "cannot loop on category")
			return
		}
		err = models.InsertIntoCategoryPost(int(idPost), catId, db)
		if err != nil {
			utils.SendError(w, http.StatusBadRequest, "cannot insert into category")
			return
		}
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
}
