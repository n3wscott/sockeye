package controller

import (
	"encoding/json"
	"fmt"

	cloudevents "github.com/cloudevents/sdk-go/v2"
)

func (c *Controller) CeHandler(event cloudevents.Event) {
	fmt.Println("got", event.String())

	// TODO: cloudevents needs a websocket transport.

	b, err := json.Marshal(event)
	if err != nil {
		fmt.Println("err", err)
		return
	}

	manager.broadcast <- string(b)

	return
}
