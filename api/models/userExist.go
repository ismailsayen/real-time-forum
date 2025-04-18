package models

import "database/sql"

func UserExist(userName string, db *sql.DB) (int, error) {
	query := `SELECT id FROM users WHERE Email=? OR NickName=?`
	id := 0
	err := db.QueryRow(query, userName, userName).Scan(&id)
	if err != nil {
		return -1, err
	}
	return id, nil
}
