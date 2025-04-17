package routes

import (
	"database/sql"
	"net/http"

	"rtFroum/api/handlers"
	"rtFroum/api/handlers/auth"
)

func Routers(db *sql.DB) {
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/static/", handlers.Static)
	http.HandleFunc("/login", auth.Login)
}
