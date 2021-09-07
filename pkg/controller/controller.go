package controller

import (
	"fmt"
	"net/http"
	"sync"

	cloudevents "github.com/cloudevents/sdk-go/v2"
	"golang.org/x/net/websocket"
)

type Controller struct {
	ceClient    cloudevents.Client
	rootHandler http.Handler
	root        string
	mux         *http.ServeMux
	once        sync.Once
}

func New(root string) *Controller {
	ceClient, err := cloudevents.NewClientHTTP()
	if err != nil {
		fmt.Printf("failed to create client, %v", err)
	}
	return &Controller{
		root:     root,
		ceClient: ceClient,
	}
}

func (c *Controller) Mux() *http.ServeMux {
	c.once.Do(func() {
		m := http.NewServeMux()
		m.HandleFunc("/ui", c.RootHandler)
		m.Handle("/ws", websocket.Handler(c.WSHandler))
		c.mux = m
	})

	return c.mux
}
