package controller

import (
	"context"
	"encoding/json"
	"log"
	"net/http"

	metav1 "k8s.io/apimachinery/pkg/apis/meta/v1"
	"k8s.io/apimachinery/pkg/runtime/schema"
)

// TODO: ADD BROKERS
// QueryServicesHandler is a handler to return a list of services in the current namespace
func (c *Controller) QueryServicesHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	resources := c.servingClient.ServingV1().Routes(c.namespace)
	x, err := resources.List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		panic(err)
	}

	var services []interface{}
	for _, y := range x.Items {
		services = append(services, y.Status.URL)
	}

	gvr := schema.GroupVersionResource{
		Group:    "eventing.knative.dev",
		Version:  "v1",
		Resource: "brokers",
	}

	list, err := c.dC.Resource(gvr).Namespace(c.namespace).List(context.TODO(), metav1.ListOptions{})
	if err != nil {
		log.Printf("Failed to List Brokers, %v", err)

	}

	for _, item := range list.Items {
		x := "http://broker-ingress.knative-eventing.svc.cluster.local/" + c.namespace + "/" + item.GetName()
		services = append(services, x)
	}

	json.NewEncoder(w).Encode(services)
}
