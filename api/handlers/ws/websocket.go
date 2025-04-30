package ws

import (
	"database/sql"
	"encoding/json"
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
type SendMessage struct {
	Type       string `json:"type"`
	Content    string `json:"content"`
	ReceiverId int    `json:"to"`
	Date       int    `json:"date"`
}

func WebSocket(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, _, err := models.GetUserId(r, db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}
	clients[conn] = id
	sendUserList()
	var data Messages
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {
			delete(clients, conn)
			sendUserList()
			break
		}
		err = json.Unmarshal(msg, &data)
		if err != nil {
			delete(clients, conn)
			sendUserList()
			break
		}
		if data.Type == "getMessages" {
			m, err := models.GetMessages(id, data.Receiver, db)
			if err != nil {
				utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			data, _ := json.Marshal(m)
			for client := range clients {
				client.WriteMessage(websocket.TextMessage, data)
			}

		}
		if data.Type == "sendMessages" {
			var newMsg SendMessage
			err = json.Unmarshal(msg, &newMsg)
			if err != nil {
				delete(clients, conn)
				sendUserList()
				break
			}
			messageSent, err := models.SendMessage(newMsg.Content, id, newMsg.ReceiverId, newMsg.Date, db)
			if err != nil {
				utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			data, _ := json.Marshal(messageSent)
			for client := range clients {
				client.WriteMessage(websocket.TextMessage, data)
			}
		}
	}
}
