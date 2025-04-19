package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"rtFroum/utils"
)

func HomeHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.URL.Path != "/" {
		fmt.Println("1", r.URL.Path)
		utils.SendError(w, http.StatusNotFound, "Page Not Found")
		fmt.Println("kk")
		return
	}
	fmt.Println("2", r.URL.Path)
	
	TempExec(w, r)
}
