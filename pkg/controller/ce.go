package controller

import (
	"fmt"
	cloudevents "github.com/cloudevents/sdk-go"
	"github.com/cloudevents/sdk-go/pkg/cloudevents/codec"
)

func (c *Controller) CeHandler(event cloudevents.Event) {
	fmt.Println("got", event.String())

	// TODO: cloudevents needs a websocket transport.

	b, err := codec.JsonEncodeV03(event)
	if err != nil {
		fmt.Println("err", err)
		return
	}

	manager.broadcast <- string(b)

	return
}
