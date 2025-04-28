package ws

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

func sendUserList(id int) {
	var ids []int
	for _, idU := range clients {
		if idU != id {
			ids = append(ids, idU)
		}
	}
	fmt.Println(ids)
	userListMessage := map[string]interface{}{
		"type":  "userList",
		"users": ids,
	}

	data, _ := json.Marshal(userListMessage)

	for client := range clients {
		client.WriteMessage(websocket.TextMessage, data)
	}
}
