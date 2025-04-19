package database

type User struct {
	NickName  string `json:"nickname"`
	Password  string `json:"password"`
	Age       int    `json:"age"`
	Gender    string `json:"gender"`
	FirstName string `json:"firstName"`
	LastName  string `json:"lastName"`
	Email     string `json:"email"`
}
type Error struct {
	Message string `json:"message"`
	Status  int    `json:"status"`
}
type Comment struct {
	Id      int    `json:"id"`
	Content string `json:"content"`
	IdUser  int    `json:"iduser"`
	IdPost  int    `json:"idPost"`
	Date    int `json:"date"`
}
