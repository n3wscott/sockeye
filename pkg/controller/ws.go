package controller

import (
	"log"

	"github.com/google/uuid"
	"golang.org/x/net/websocket"
)

var (
	manager clientManager
)

type clientManager struct {
	clients    map[*client]bool
	broadcast  chan interface{}
	register   chan *client
	unregister chan *client
}

func (manager *clientManager) start() {
	for {
		select {
		case conn := <-manager.register:
			manager.clients[conn] = true
		case conn := <-manager.unregister:
			if _, ok := manager.clients[conn]; ok {
				close(conn.send)
				delete(manager.clients, conn)
			}
		case message := <-manager.broadcast:
			log.Printf("Broadasting to %d clients: %+v", len(manager.clients), message)
			for conn := range manager.clients {
				log.Printf("Broadasting message to client %s", conn.id)
				select {
				case conn.send <- message:
				default:
					close(conn.send)
					delete(manager.clients, conn)
				}
			}
		}
	}
}

func (manager *clientManager) send(message interface{}) {
	for conn := range manager.clients {
		conn.send <- message
	}
}

type client struct {
	id     string
	socket *websocket.Conn
	send   chan interface{}
}

func (c *client) write() {
	defer func() {
		c.socket.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			log.Printf("On send %v - %v", message, ok)
			if !ok {
				log.Println("Unable to sent")
				return
			}
			websocket.JSON.Send(c.socket, message)
		}
	}
}

func init() {
	manager = clientManager{
		broadcast:  make(chan interface{}, 100),
		register:   make(chan *client),
		unregister: make(chan *client),
		clients:    make(map[*client]bool),
	}
	go manager.start()
}

func (c *Controller) WSHandler(ws *websocket.Conn) {
	log.Println("WS connection...")

	client := &client{
		id:     uuid.New().String(),
		socket: ws,
		send:   make(chan interface{}),
	}
	manager.register <- client
	client.write()
}
