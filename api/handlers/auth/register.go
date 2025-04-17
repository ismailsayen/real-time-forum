package auth

import (
	"encoding/json"
	"fmt"
	"net/http"
	"rtFroum/database"
	"rtFroum/utils"
)

func Register(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodPost {
		data := &database.Error{Message: "Methode Not Allowed", Status: http.StatusMethodNotAllowed}
		resp, err := utils.Marshal(w, data, data.Status)
		if err != nil {
			http.Error(w, "Server error", http.StatusInternalServerError)
			return
		}
		w.Write(resp)
		return
	}
	var user database.User

	if r.Body == nil {
		http.Error(w, "Empty request body", http.StatusBadRequest)
		return
	}
		if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
			http.Error(w, "Invalid json format data", http.StatusBadRequest)
			return
		}
	if  user.Email == "" || user.FirstName == "" || user.Gender == "" || user.LastName == "" || user.Password == "" || user.Username == ""||user.Age == 0 {
    // fmt.Println("error less data ")
	http.Error(w, "All fields are required", http.StatusBadRequest)
	return 
}
fmt.Println("succ",user)
	
	

}
