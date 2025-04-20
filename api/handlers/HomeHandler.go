package handlers

import (
	"database/sql"
	"fmt"
	"net/http"
	"slices"
)

func HomeHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	frontUrl := []string{"/", "/auth"}
	if !slices.Contains(frontUrl, r.URL.Path) {
		fmt.Println("llklkl", r.URL.Path)
		// utils.SendError(w, http.StatusNotFound, "Page Not Found")
		w.WriteHeader(http.StatusNotFound)
		TempExec(w, r)
		return
	}
	TempExec(w, r)

}
