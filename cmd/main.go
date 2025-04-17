package main

import (
	"fmt"
	"net/http"
	"rtFroum/routes"
)

func main() {
	routes.Routers()
	fmt.Println("http://localhost:8080/")
	http.ListenAndServe(":8080", nil)
}
