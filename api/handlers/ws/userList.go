package ws

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func sendUserList(nickname string) {
	var ids []int
	for _, idU := range clients {
		ids = append(ids, idU)
	}
	userListMessage := map[string]interface{}{
		"type":     "userList",
		"nickname": nickname,
		"users":    ids,
	}

	data, _ := json.Marshal(userListMessage)
	fmt.Println(clients)
	for client := range clients {
		client.WriteMessage(websocket.TextMessage, data)
	}
}
