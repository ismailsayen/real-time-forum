package ws

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

func sendUserList() {
	var ids []int
	for idU := range clients {
		ids = append(ids, idU)
	}
	userListMessage := map[string]interface{}{
		"type":  "userList",
		"users": ids,
	}

	data, _ := json.Marshal(userListMessage)
	mu.Lock()
	for _, client := range clients {
		for _, c := range client {
			c.WriteMessage(websocket.TextMessage, data)
		}
	}
	mu.Unlock()
}
