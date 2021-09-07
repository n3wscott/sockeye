package main

import (
	"context"
	"log"
	"net/http"
	"path"
	"strings"

	cloudevents "github.com/cloudevents/sdk-go/v2"
	"github.com/kelseyhightower/envconfig"
	"github.com/n3wscott/sockeye/pkg/controller"
)

type envConfig struct {
	DataPath string `envconfig:"KO_DATA_PATH" default:"/var/run/ko/" required:"true"`
	WWWPath string `envconfig:"WWW_PATH" default:"www" required:"true"`
	Port     int    `envconfig:"PORT" default:"8080" required:"true"`
}

func main() {
	var env envConfig
	if err := envconfig.Process("", &env); err != nil {
		log.Fatalf("failed to process env var: %s", err)
	}

	www := path.Join(env.DataPath, env.WWWPath)
	if !strings.HasSuffix(www, "/") {
		www = www + "/"
	}

	c := controller.New(www)

	t, err := cloudevents.NewHTTP(
		cloudevents.WithPath("/ce"), // hack hack
	)
	if err != nil {
		log.Fatalf("failed to create cloudevents transport, %s", err.Error())
	}
	// I am doing this to allow root to be both POST for cloudevents and GET as root ui.
	c.Mux().HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "POST" {
			t.ServeHTTP(w, r)
			return
		}
		c.RootHandler(w, r)
	})
	t.Handler = c.Mux()

	ce, err := cloudevents.NewClient(t, cloudevents.WithUUIDs(), cloudevents.WithTimeNow())
	if err != nil {
		log.Fatalf("failed to create cloudevents client, %s", err.Error())
	}

	log.Printf("Server starting on port 8080\n")
	if err := ce.StartReceiver(context.Background(), c.CeHandler); err != nil {
		log.Fatalf("failed to start cloudevent receiver, %s", err.Error())
	}
}
