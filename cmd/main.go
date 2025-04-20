package main

import (
	"fmt"
	"log"
	"net/http"

	"rtFroum/database"
	"rtFroum/routes"
)

func main() {
	db, err := database.OpenDB()
	if err != nil {
		log.Fatal(err)
	}
	
	routes.Routers(db)
	fmt.Println("http://localhost:8080/")
	http.ListenAndServe(":8080", nil)
}
