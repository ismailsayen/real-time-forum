package handlers


import (
	"fmt"
	"net/http"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool { return true }, 
}

func HandleWebSocket(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		fmt.Println("Upgrade error:", err)
		return
	}
	defer conn.Close()

	for {
		// Read message
		_, msg, err := conn.ReadMessage()
		if err != nil {
			fmt.Println("Read error:", err)
			break
		}
		fmt.Println("Received:", string(msg))

		// Echo message back
		err = conn.WriteMessage(websocket.TextMessage, []byte("Server says: "+string(msg)))
		if err != nil {
			fmt.Println("Write error:", err)
			break
		}
	}
}



var clients = make(map[*websocket.Conn]bool) // all connected clients
var broadcast = make(chan Message)           // broadcast channel

type Message struct {
	Type    string `json:"type"`
	PostID  int    `json:"postId"`
	Comment string `json:"comment"`
	Time    string `json:"time"`
}

func HandleConnections(w http.ResponseWriter, r *http.Request) {
	conn, _ := upgrader.Upgrade(w, r, nil)
	defer conn.Close()
	clients[conn] = true

	for {
		var msg Message
		err := conn.ReadJSON(&msg)
		if err != nil {
			delete(clients, conn)
			break
		}
		broadcast <- msg
	}
}

func HandleMessages() {
	for {
		msg := <-broadcast
		for client := range clients {
			err := client.WriteJSON(msg)
			if err != nil {
				client.Close()
				delete(clients, client)
			}
		}
	}
}