package ws

import (
	"encoding/json"

	"github.com/gorilla/websocket"
)

func sendUserList() {
	var ids []int
	for _, idU := range clients {
		ids = append(ids, idU)
	}
	userListMessage := map[string]interface{}{
		"type":  "userList",
		"users": ids,
	}

	data, _ := json.Marshal(userListMessage)

	for client := range clients {
		client.WriteMessage(websocket.TextMessage, data)
	}
}
