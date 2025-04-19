package utils

import (
	"encoding/json"
	"fmt"
	"net/http"
	"rtFroum/database"
)

func SendError(w http.ResponseWriter, status int, message string) {
	errorResponse := database.Error{
		Status:  status,
		Message: message,
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	fmt.Println(message)
	json.NewEncoder(w).Encode(errorResponse)
}
