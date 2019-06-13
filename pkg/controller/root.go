package controller

import (
	"html/template"
	"net/http"
	"sync"
)

var once sync.Once
var t *template.Template

func (c *Controller) RootHandler(w http.ResponseWriter, r *http.Request) {
	once.Do(func() {
		t, _ = template.ParseFiles(
			c.root+"/templates/index.html",
			c.root+"/templates/main.html",
		)
	})

	data := map[string]interface{}{}

	_ = t.Execute(w, data)
}
