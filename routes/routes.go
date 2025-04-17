package routes

import (
	"net/http"
	"rtFroum/api/handlers"
)

func Routers() {
	http.HandleFunc("/", handlers.IndexHandler)
	http.HandleFunc("/static/", handlers.Static)
}
