package handlers

import (
	"database/sql"
	"net/http"
)

func HomeHandler(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	TempExec(w, r)
}


