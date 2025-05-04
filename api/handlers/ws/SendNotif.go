package ws

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func SendNotif(nickname string, sender, idReceiver, ChatID int) {
	notifMsg := map[string]interface{}{
		"type":    "notification",
		"usersid": sender,
		"message": fmt.Sprintf("%s send message to you.", nickname),
		"chatID":  ChatID,
	}
	data, _ := json.Marshal(notifMsg)
	for _, conn := range clients[idReceiver] {
		conn.WriteMessage(websocket.TextMessage, data)
	}
}
