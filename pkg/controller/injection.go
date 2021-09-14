package controller

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"

	cloudevents "github.com/cloudevents/sdk-go/v2"
)

func (c *Controller) InjectionHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
	json.NewEncoder(w).Encode("OKOK")

	body, err := ioutil.ReadAll(r.Body)
	if err != nil {
		fmt.Printf("Error occured reading body: %v", err)
		json.NewEncoder(w).Encode("Failure reding request")
	}
	ip := &injectionPayload{}
	if err := json.Unmarshal(body, ip); err != nil {
		fmt.Printf("Error occured unmarsaling data: %v", err)
		return
	}

	eventToSend := cloudevents.NewEvent()
	eventToSend.SetType(ip.Headers.CeType)
	eventToSend.SetSource(ip.Headers.CeSource)
	eventToSend.SetID(ip.Headers.CeID)
	eventToSend.SetDataContentType(ip.Headers.ContentType)
	eventToSend.SetData(cloudevents.ApplicationJSON, ip.Data)

	ctx := cloudevents.ContextWithTarget(context.Background(), ip.Destination)

	if result := c.ceClient.Send(ctx, eventToSend); cloudevents.IsUndelivered(result) {
		fmt.Printf("failed to send, %v", result)
	}

	fmt.Printf("sent Event to: %v", ip.Destination)
	fmt.Println("")
	fmt.Println(eventToSend)

}
