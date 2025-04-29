package ws

import (
	"database/sql"
	"encoding/json"
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

type Messages struct {
	Type     string `json:"type"`
	Receiver int    `json:"to"`
}

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
	var data Messages
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			delete(clients, conn)
			sendUserList(nickname)
			break
		}
		err = json.Unmarshal(msg, &data)
		if err != nil {
			delete(clients, conn)
			sendUserList(nickname)
			break
		}
		if data.Type == "getMessages" {
			m, err := models.GetMessages(id, data.Receiver, db)
			if err != nil {
				utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			dataa := map[string]interface{}{
				"type":"conversation",
				"conversation": m,
			}
			
			data, _ := json.Marshal(dataa)
			for client := range clients {
				client.WriteMessage(websocket.TextMessage, data)
			}
			fmt.Println(string(data))
		}
	}
}
