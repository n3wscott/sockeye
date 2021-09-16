package controller

import (
	"fmt"
	"net/http"
	"os"
	"sync"

	cloudevents "github.com/cloudevents/sdk-go/v2"
	"k8s.io/client-go/rest"
	"k8s.io/client-go/tools/clientcmd"
	servingclientset "knative.dev/serving/pkg/client/clientset/versioned"

	"golang.org/x/net/websocket"
)

type Controller struct {
	ceClient      cloudevents.Client
	rootHandler   http.Handler
	root          string
	mux           *http.ServeMux
	once          sync.Once
	namespace     string
	servingClient *servingclientset.Clientset
}

func New(root, kubeConfigLocation, cluster string) *Controller {
	ceClient, err := cloudevents.NewClientHTTP()
	if err != nil {
		fmt.Printf("failed to create client, %v", err)
	}

	namespace, err := returnNamespace()
	if err != nil {
		fmt.Printf("Error fetching namespace: %v", err)
	}

	config, err := BuildClientConfig(kubeConfigLocation, cluster)
	if err != nil {
		fmt.Printf("Error building kube client: %v", err)
	}

	servingClient := servingclientset.NewForConfigOrDie(config)

	return &Controller{
		root:          root,
		ceClient:      ceClient,
		namespace:     namespace,
		servingClient: servingClient,
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

func returnNamespace() (string, error) {
	dat, err := os.ReadFile("/var/run/secrets/kubernetes.io/serviceaccount/namespace")
	if err != nil {
		fmt.Println("Error reading file:", err)
		return "", err
	}
	fmt.Printf("found namespace %v ", string(dat))
	s := string(dat)
	return s, nil
}

// BuildClientConfig builds the client config specified by the config path and the cluster name
func BuildClientConfig(kubeConfigPath string, clusterName string) (*rest.Config, error) {

	if cfg, err := clientcmd.BuildConfigFromFlags("", ""); err == nil {
		// success!
		return cfg, nil
	}
	// try local...

	overrides := clientcmd.ConfigOverrides{}
	// Override the cluster name if provided.
	if clusterName != "" {
		overrides.Context.Cluster = clusterName
	}

	return clientcmd.NewNonInteractiveDeferredLoadingClientConfig(
		&clientcmd.ClientConfigLoadingRules{ExplicitPath: kubeConfigPath},
		&overrides).ClientConfig()
}
