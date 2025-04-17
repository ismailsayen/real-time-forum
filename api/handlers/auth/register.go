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
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	var user database.User

	if r.Body == nil {
		utils.SendError(w, http.StatusBadRequest, "Empty request body")
		return
	}
	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid json format data")
		return
	}
	if user.Email == "" || user.FirstName == "" || user.Gender == "" || user.LastName == "" || user.Password == "" || user.Username == "" || user.Age == 0 {
		// fmt.Println("error less data ")
		utils.SendError(w, http.StatusBadRequest, "All fields are required")
		return
	}
	if user.Age <= 18 {
		utils.SendError(w, http.StatusBadRequest, "Age must be greater than 18")
		return
	}
	if !utils.IsValidEmail(user.Email) {
		utils.SendError(w, http.StatusBadRequest, "Invalid email format")
		return
	}

	fmt.Println("succ", user)

}
