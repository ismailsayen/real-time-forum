package models

import (
	"database/sql"
	"net/http"
	"strings"

	"rtFroum/database"
)

func Register(user database.User, db *sql.DB, strErr *database.ErrorRegister) (int, string) {
	query := `INSERT INTO users (Nickname,FirstName,LastName,Email,Password,Age,Gender)
	VALUES (?,?,?,?,?,?,?)
	`
	stm, err := db.Prepare(query)
	if err != nil {
		return 0, "Error Preparing the quey"
	}
	defer stm.Close()
	res, err := stm.Exec(user.NickName, user.FirstName, user.LastName, user.Email, user.Password, user.Age, strings.ToLower(user.Gender))
	if err != nil {
		errMsg := strings.ToLower(err.Error())
		if strings.Contains(errMsg, "nickname") {
			strErr.ErrNickName = "NickName already exists"
			return 0, "NickName already exists"
		} else if strings.Contains(errMsg, "email") {
			strErr.ErrEmail = "Email already exists"
			return 0, "Email already exists"
		}
		return 0, "Error inserting user into database"
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, "Error getting last id inserted"
	}
	return int(id), ""
}

func GetUserId(r *http.Request, db *sql.DB) (int, string, error) {
	var userId int
	var nickname string
	token, err := r.Cookie("token")

	if err != nil || token.Value == "" {
		return 0, "", err
	}
	value := token.Value
	query := "SELECT s.ID_User, u.Nickname FROM session s INNER JOIN users u ON s.ID_User = u.ID WHERE token = ?"
	stm, err := db.Prepare(query)
	if err != nil {
		return 0, "", err
	}
	err = stm.QueryRow(value).Scan(&userId, &nickname)
	return int(userId), nickname, err
}

func FetchUsers(db *sql.DB, id int) ([]database.User, error) {
	rows, err := db.Query("SELECT ID, Nickname FROM Users WHERE ID <> ?", id)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var users []database.User
	for rows.Next() {
		var u database.User
		err := rows.Scan(&u.ID, &u.NickName)
		if err != nil {
			return nil, err
		}
		users = append(users, u)
	}
	return users, nil
}
