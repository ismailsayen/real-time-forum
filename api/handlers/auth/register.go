package auth

import (
	"database/sql"
	"encoding/json"
	"html"
	"io"
	"net/http"
	"strings"

	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
)

func Register(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	if r.Method != http.MethodPost {
		utils.SendError(w, http.StatusMethodNotAllowed, "Method Not Allowed")
		return
	}
	var user database.User
	var Errors database.ErrorRegister

	if err := json.NewDecoder(r.Body).Decode(&user); err != nil {
		utils.SendError(w, http.StatusBadRequest, "Invalid json format data")
		return
	}
	if !VerifyData(&user, &Errors, r.Body) {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Errors)
		return
	}
	user.Password = utils.HashPassword(user.Password)
	user.FirstName=html.EscapeString(user.FirstName)
	user.LastName=html.EscapeString(user.LastName)
	user.NickName=html.EscapeString(strings.Trim(user.NickName," "))

	id, err := models.Register(user, db, &Errors)
	if len(err) > 0 {
		w.Header().Set("Content-Type", "application/json")
		w.WriteHeader(http.StatusBadRequest)
		json.NewEncoder(w).Encode(Errors)
		return
	}

	err1 := models.CreateSession(w, id, db)
	if err1 != nil {
		utils.SendError(w, http.StatusInternalServerError, "Cannot Create Sessions")
		return
	}
	utils.SendError(w, http.StatusOK, "your are logged")
}

func VerifyData(user *database.User, errStruct *database.ErrorRegister, Body io.ReadCloser) bool {
	if user.Email == "" || user.FirstName == "" || user.Gender == "" || user.LastName == "" || user.Password == "" || user.NickName == "" || user.Age == 0 || Body == nil {
		errStruct.ErrEmpty = "All fields are required"
	}
	if user.Age <= 18 && user.Age>=100 {
		errStruct.ErrAge = "Age must be greater than 18 or less than 100"
	}
	if !utils.IsValidEmail(user.Email) {
		errStruct.ErrEmail = "Invalid email format"
	}
	if len(user.NickName) > 30 || strings.Contains(user.NickName," "){
		errStruct.ErrNickName = "Invalid Nickname Format "
	}

	if len(user.Email) > 30 {
		errStruct.ErrEmail = "field Content too large"
	}

	if len(user.Password) > 30 {
		errStruct.ErrPassword = "field Content too large"
	}

	if len(user.FirstName) > 30 {
		errStruct.ErrFirstName = "field Content too large"
	}

	if len(user.LastName) > 30 {
		errStruct.ErrLastName = "field Content too large"
	}
	if errStruct.ErrEmpty != "" || errStruct.ErrNickName != "" || errStruct.ErrPassword != "" || errStruct.ErrAge != "" || errStruct.ErrGender != "" || errStruct.ErrFirstName != "" || errStruct.ErrLastName != "" || errStruct.ErrEmail != "" {
		return false
	}

	return true
}
