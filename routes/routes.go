package routes

import (
	"database/sql"
	"net/http"

	"rtFroum/api/handlers"
	"rtFroum/api/handlers/auth"
	"rtFroum/middleware"
)

func Routers(db *sql.DB) {
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		auth.Login(w, r, db)
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		auth.Register(w, r, db)
	})

	http.HandleFunc("/addComment", func(w http.ResponseWriter, r *http.Request) {
		handlers.CommentHandler(w, r, db)
	})
	http.HandleFunc("/addPost", func(w http.ResponseWriter, r *http.Request) {
		handlers.PostHandler(w, r, db)
	})
	http.HandleFunc("/isLog", func(w http.ResponseWriter, r *http.Request) {
		middleware.VerifyCookie(w, r, db)
	})
	http.HandleFunc("/static/", handlers.Static)
}
