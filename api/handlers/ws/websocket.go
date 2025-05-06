package ws

import (
	"database/sql"
	"encoding/json"
	"sync"

	"net/http"

	"rtFroum/api/models"
	"rtFroum/utils"

	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true },
}
var mu sync.Mutex
var clients = make(map[int][]*websocket.Conn)

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
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	id, nickname, err := models.GetUserId(r, db)
	if err != nil {
		utils.SendError(w, http.StatusInternalServerError, err.Error())
		return
	}

	clients[id] = append(clients[id], conn)
	sendUserList()

	var data Messages
	for {
		_, msg, err := conn.ReadMessage()
		if err != nil {

			removeConnection(id, conn)
			sendUserList()

			break
		}

		err = json.Unmarshal(msg, &data)
		if err != nil {

			removeConnection(id, conn)
			sendUserList()

			break
		}
		if data.Type == "getAllUsers" {
			users, newUser, err := models.FetchUsers(db, id)
			if err != nil {
				return
			}
			data, _ := json.Marshal(users)

			for _, c := range clients[id] {
				if c == conn {
					c.WriteMessage(websocket.TextMessage, data)
				}
			}

			data, _ = json.Marshal(newUser)

			for keyId, conns := range clients {
				if keyId != id {
					for _, conn := range conns {
						conn.WriteMessage(websocket.TextMessage, data)
					}
				}
			}

			sendUserList()
		}
		if data.Type == "getMessages" {
			chatId, err := models.GetOrCreateChat(db, id, data.Receiver)
			if err != nil {
				utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}

			m, err := models.GetMessages(id, data.Receiver, chatId, data.Offset, data.Limit, db)
			if err != nil {
				utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			data, _ := json.Marshal(m)
			for _, conn := range clients[id] {
				conn.WriteMessage(websocket.TextMessage, data)
			}

		}
		if data.Type == "sendMessages" {
			var newMsg SendMessage
			err = json.Unmarshal(msg, &newMsg)
			if err != nil {
				removeConnection(id, conn)
				sendUserList()
				break
			}
			messageSent, err := models.SendMessage(newMsg.Content, nickname, id, newMsg.ReceiverId, newMsg.Date, newMsg.ChatID, db)
			if err != nil {
				utils.SendError(w, http.StatusInternalServerError, err.Error())
				return
			}
			data, _ := json.Marshal(messageSent)
			if conns, exists := clients[id]; exists {
				for _, conn := range conns {
					conn.WriteMessage(websocket.TextMessage, data)
				}
			}
			if conns, exists := clients[newMsg.ReceiverId]; exists {
				for _, conn := range conns {
					conn.WriteMessage(websocket.TextMessage, data)
				}
			}

			go func() {
				LatestUsers, err := models.LastUsersMessaged(db, id)
				if err != nil {
					utils.SendError(w, http.StatusInternalServerError, err.Error())
					return
				}
				data, _ := json.Marshal(LatestUsers)
				mu.Lock()
				if conns, exists := clients[id]; exists {
					for _, conn := range conns {
						conn.WriteMessage(websocket.TextMessage, data)
					}
				}
				mu.Unlock()
				sendUserList()
			}()
			go func() {
				LatestUsers, err := models.LastUsersMessaged(db, newMsg.ReceiverId)
				if err != nil {
					utils.SendError(w, http.StatusInternalServerError, err.Error())
					return
				}
				data, _ := json.Marshal(LatestUsers)
				mu.Lock()
				if conns, exists := clients[newMsg.ReceiverId]; exists {
					for _, conn := range conns {
						conn.WriteMessage(websocket.TextMessage, data)
					}
				}
				mu.Unlock()
				sendUserList()
			}()
			
			sendUserList()
			SendNotif(nickname, id, newMsg.ReceiverId, newMsg.ChatID)
		}

		if data.Type == "typing" || data.Type == "stopTyping" {
			typingData := map[string]interface{}{
			  "type": data.Type,
			  "from": id,
			}
			typing, _ := json.Marshal(typingData)
		  
			if conns, exists := clients[data.Receiver]; exists {
			  for _, conn := range conns {
				conn.WriteMessage(websocket.TextMessage, typing)
			  }
			}
		  }

		if data.Type == "user-close" {
			removeConnection(id, conn)
			sendUserList()
			break
		}
	}
}

func removeConnection(userId int, conn *websocket.Conn) {
	if conns, exists := clients[userId]; exists {
		for i, c := range conns {
			if c == conn {
				clients[userId] = append(conns[:i], conns[i+1:]...)
				break
			}
		}
		if len(clients[userId]) == 0 {
			delete(clients, userId)
		}
	}
}
