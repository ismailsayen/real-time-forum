package database

type User struct {
	Username string `json:"username"`
	Password     string `json:"password"`
	Age		int 	`json:"age"`
	Gender  string 	`json:"gender"`
	FirstName	string `json:"firstName"`
	LastName	string	`json:"lastName"`
	Email 	string 	`json:"email"` 	
}
type Error struct {
	Message string `json:"message"`
	Status    int    `json:"status"`
}
