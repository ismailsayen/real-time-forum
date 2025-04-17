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
	json.NewDecoder(r.Body).Decode(&user)
	fmt.Println(user)
}
