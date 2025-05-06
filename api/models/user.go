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

func FetchUsers(db *sql.DB, id int) (map[string]interface{}, map[string]interface{}, error) {
	query:=`SELECT u.ID, u.Nickname,
		(
			SELECT MAX(m.Sent_At)
			FROM Messages m
			WHERE (m.Sender_ID = ? AND m.Reciever_ID = u.ID)
			   OR (m.Reciever_ID = ? AND m.Sender_ID = u.ID)
		) AS lastAt
	FROM Users u
	WHERE u.ID <> ?
	ORDER BY lastAt DESC, u.Nickname ASC;
	`
	row, err := db.Query(query, id,id,id)
	if err != nil {
		return nil, nil,err
	}
	defer row.Close()
	row2, err := db.Query("SELECT ID, Nickname FROM Users WHERE ID = ?", id)
	if err != nil {
		return nil, nil, err
	}
	defer row2.Close()
	var users []database.User
	for row.Next() {
		var u database.User
		err := row.Scan(&u.ID, &u.NickName,&u.Last)
		if err != nil {
			return nil, nil, err
		}
		users = append(users, u)
	}
	var newUser database.User
	for row2.Next() {
		err := row2.Scan(&newUser.ID, &newUser.NickName)
		if err != nil {
			return nil, nil, err
		}
	}

	user := map[string]interface{}{
		"type":  "NewUserJoinned",
		"user": newUser,
	}
	usersList := map[string]interface{}{
		"type":  "AllUsers",
		"users": users,
	}
	return usersList, user, nil
}
