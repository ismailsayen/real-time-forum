package database

import "database/sql"

type User struct {
	ID        int           `json:"id"`
	NickName  string        `json:"nickname"`
	Password  string        `json:"password"`
	Age       int           `json:"age"`
	Gender    string        `json:"gender"`
	FirstName string        `json:"firstName"`
	LastName  string        `json:"lastName"`
	Email     string        `json:"email"`
	Last      sql.NullInt64 `json:"last"`
}
type Posts struct {
	ID         int      `json:"id"`
	UserID     int      `json:"user_id"`
	Title      string   `json:"title"`
	Content    string   `json:"content"`
	Categories []string `json:"categories"`
	CreatedAt  int      `json:"created_at"`
	NickName   string   `json:"nickname"`
	NBCmnts    int      `json:"nbCmnts"`
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
	Id       int    `json:"id"`
	Content  string `json:"content"`
	IdUser   int    `json:"iduser"`
	IdPost   int    `json:"idPost"`
	Date     int    `json:"date"`
	NickName string `json:"nickname"`
}
type ErrorRegister struct {
	ErrEmpty     string `json:"ErrEmpty"`
	ErrNickName  string `json:"Errnickname"`
	ErrPassword  string `json:"Errpassword"`
	ErrAge       string `json:"Errage"`
	ErrGender    string `json:"Errgender"`
	ErrFirstName string `json:"ErrfirstName"`
	ErrLastName  string `json:"ErrlastName"`
	ErrEmail     string `json:"Erremail"`
}

type Conversation struct {
	ID        int `json:"id"`
	User1ID   int `json:"user1_id"`
	User2ID   int `json:"user2_id"`
	CreatedAt int `json:"created_at"`
}

type ChatMessage struct {
	ID               int    `json:"id"`
	ReceiverNickname string `json:"receiver_nickname"`
	Content          string `json:"content"`
	SentAt           int    `json:"sent_at"`
}
