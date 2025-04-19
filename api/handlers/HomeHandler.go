package handlers

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rtFroum/api/models"
	"rtFroum/utils"
)

func HomeHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.URL.Path != "/" {
		fmt.Println("1", r.URL.Path)
		utils.SendError(w, http.StatusNotFound, "Page Not Found")
		fmt.Println("kk")
		return
	}

	posts, err := models.GetPosts(db)
	if err != nil {
		fmt.Println(err)
		utils.SendError(w, http.StatusInternalServerError, "Cannot Fetch Post")
		return
	}
	fmt.Println("2", r.URL.Path)

	
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	TempExec(w, r)
	json.NewEncoder(w).Encode(posts)
}
