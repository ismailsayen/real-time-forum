package routes

import (
	"net/http"

	"rtFroum/api/handlers"
	"rtFroum/api/handlers/auth"
)

func Routers() {
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/static/", handlers.Static)
	http.HandleFunc("/login", auth.Login)
}
