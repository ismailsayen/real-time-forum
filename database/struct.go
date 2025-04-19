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
type Posts struct {
	ID         int      `json:"id"`
	UserID     int      `json:"user_id"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Categories []string `json:"categories"`
	CreatedAt  int      `json:"created_at"`
	NickName   string   `json:"nickname"`
}
type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
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
	Date    int    `json:"date"`
}
