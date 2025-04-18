package auth

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"
	"rtFroum/api/models"
	"rtFroum/database"
	"rtFroum/utils"
	"time"

	"github.com/gofrs/uuid"
)
func RegisterHandler(db *sql.DB) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		Register(w, r, db) 
	}
}
func Register(w http.ResponseWriter, r *http.Request, db *sql.DB) {
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
	// fmt.Println("succ", user)
	if user.Email == "" || user.FirstName == "" || user.Gender == "" || user.LastName == "" || user.Password == "" || user.NickName == "" || user.Age == 0 {
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
	if len(user.NickName) > 30 || len(user.Email) > 30 || len(user.Password) > 30 || len(user.FirstName) > 30 || len(user.LastName) > 30 {
		utils.SendError(w, http.StatusBadRequest, "field Content too large ")
		return
	}
	user.Password = utils.HashPassword(user.Password)
	id, err := models.Register(user, db)
	if len(err) > 0 {
		utils.SendError(w, http.StatusInternalServerError, err)
		return 
	}
	token, errr := uuid.NewV4()
	if errr != nil {
		utils.SendError(w, http.StatusInternalServerError, "cant generate new token for session")
		return
	}
	err1 := models.CreateSession(id, token.String(), time.Now().Add((24 * time.Hour)), db)
	if err1 != nil {
		utils.SendError(w, http.StatusInternalServerError, "Cannot Create Sessions")
		return
	}
	http.SetCookie(w, &http.Cookie{
		Name:     "token",
		Value:    token.String(),
		HttpOnly: true,
		Expires:  time.Now().Add((24 * time.Hour)),
	})
	fmt.Println("user created succccc")
}
