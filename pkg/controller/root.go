package controller

import (
	"net/http"
	"sync"
)

var once sync.Once

func (c *Controller) RootHandler(w http.ResponseWriter, r *http.Request) {
	once.Do(func() {
		c.rootHandler = http.FileServer(http.Dir(c.root))
	})

	c.rootHandler.ServeHTTP(w, r)
}
