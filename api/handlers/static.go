package handlers

import (
	"fmt"
	"net/http"
	"os"
)

func Static(w http.ResponseWriter, r *http.Request) {
	url := r.URL.Path[1:]
	file, err := os.Stat(url)
	if file.IsDir() && err != nil {
		fmt.Println(err, file.IsDir())
		return
	}
	http.ServeFile(w, r, url)
}
