package ws

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"net/http"

	"rtFroum/api/models"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
var clients = make(map[*websocket.Conn]int)

type Messages struct {
	Type     string `json:"type"`
	Receiver int    `json:"to"`
	Offset   int    `json:"offset"`
	Limit    int    `json:"limit"`
}
type SendMessage struct {
	Type       string `json:"type"`
	Content    string `json:"content"`
	ReceiverId int    `json:"to"`
	Date       int    `json:"date"`
	ChatID     int    `json:"chatID"`
}

func WebSocket(w http.ResponseWriter, r *http.Request, db *sql.DB) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		// utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, nickname, err := models.GetUserId(r, db)
	if err != nil {
		// utils.SendError(w, http.StatusInternalServerError, err.Error())
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
		kk, t, erre := models.GetUserId(r, db)
		fmt.Println("user id ",kk,t)
		if erre != nil {
			// utils.SendError(w, http.StatusInternalServerError, err.Error())
			return
		}
		err = json.Unmarshal(msg, &data)
		if err != nil {
			delete(clients, conn)
			sendUserList()
			break
		}
		if data.Type == "getMessages" {
			chatId, err := models.GetOrCreateChat(db, id, data.Receiver)
			if err != nil {
				// utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			fmt.Println("d",data)
			m, err := models.GetMessages(id, data.Receiver, chatId, data.Offset, data.Limit, db)
			fmt.Println("m",m)
			if err != nil {
				fmt.Println(err)
				// utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			data, _ := json.Marshal(m)
			for client := range clients {
				if clients[client] == id {
					client.WriteMessage(websocket.TextMessage, data)
				}
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
			messageSent, err := models.SendMessage(newMsg.Content, nickname, id, newMsg.ReceiverId, newMsg.Date, newMsg.ChatID, db)
			if err != nil {
				// utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			data, _ := json.Marshal(messageSent)
			for client := range clients {
				if clients[client] == id || clients[client] == newMsg.ReceiverId {
					client.WriteMessage(websocket.TextMessage, data)
				}
			}
		}
		if data.Type == "user-close" {
			for C, client := range clients {
				if client == id {
					C.Close()
					delete(clients, C)
				}
			}
			break
		}
	}
}
