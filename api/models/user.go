package models

import (
	"database/sql"
	"rtFroum/database"
	"strings"
)

func Register(user database.User, db *sql.DB) (int, string) {
	query := `INSERT INTO users (Nickname,FirstName,LastName,Email,Password,Age,Gender)
	VALUES (?,?,?,?,?,?,?)
	`
	stm, err := db.Prepare(query)
	if err != nil {
		return 0, "Error Preparing the quey"
	}
	defer stm.Close()
	res, err := stm.Exec(user.NickName, user.FirstName, user.LastName, user.Email, user.Password, user.Age, user.Gender)
	if err != nil {
		if strings.Contains(err.Error(), "NickName") {
			return 0, "NickName already exists"
		} else if strings.Contains(err.Error(), "Email") {
			return 0,  "email already exists"
		}
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, "Error getting last id inserted"
	}
	return int(id), ""

}
