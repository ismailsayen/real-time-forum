package handlers

import (
	"net/http"
	"os"
)

func Static(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Path[1:]
	file, _ := os.Stat(url)
	if !file.IsDir() {
		http.ServeFile(w,r,url)
	}
}
