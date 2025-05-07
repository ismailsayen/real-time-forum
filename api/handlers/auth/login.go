package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
)

func Login(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	var user database.User
	json.NewDecoder(r.Body).Decode(&user)
	if user.Password == "" || user.NickName == "" {
		utils.SendError(w, http.StatusBadRequest, "All fields are required")
		return
	}
	
	ID, err := models.UserExist(user.NickName, db)
	if err == sql.ErrNoRows {
		utils.SendError(w, http.StatusBadRequest, "Invalid email or password")
		return
	}
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	err = models.ValidPass(ID, user.Password, db)
	if err != nil {
		if err == sql.ErrNoRows || err.Error() == "unmatched" {
			utils.SendError(w, http.StatusBadRequest, "Invalid email or password")
			return
		}
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	err = models.CreateSession(w, ID, db)
	if err != nil {
		fmt.Println(err)
		utils.SendError(w, http.StatusInternalServerError, "Cannot Create Sessions")
		return
	}
}
