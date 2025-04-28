
package ws

import (
	"database/sql"
	"fmt"
	"net/http"

	"rtFroum/api/models"
	"rtFroum/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
var clients = make(map[*websocket.Conn]int)

func WebSocket(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, nickname, err := models.GetUserId(r, db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	clients[conn] = id
	sendUserList(nickname)
	fmt.Println(clients)
	// for client := range clients {
	// 	msg := []byte(fmt.Sprintf("%s has joinned 👤", nickname))
	// 	if client != conn {
	// 		err := client.WriteMessage(websocket.TextMessage, []byte(string(msg)))
	// 		if err != nil {
	// 			client.Close()
	// 			delete(clients, client)

	// 		}

	// 	}
	// }
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			delete(clients, conn)
			sendUserList(nickname)
			break
		}
		fmt.Println(msg)
	}
}
