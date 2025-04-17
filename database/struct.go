package database

type User struct {
	Username string `json:"username"`
	Pass     string `json:"pass"`
}
type Error struct {
	Message string `json:"message"`
	Status    int    `json:"code"`
}
