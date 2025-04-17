package handlers

import (
	"fmt"
	"net/http"
	"text/template"
)

func IndexHandler(w http.ResponseWriter, r *http.Request) {
	temp, err := template.ParseFiles("./template/index.html")
	if err != nil {
		fmt.Println("Error in parsing", err)
		return
	}

	err = temp.Execute(w, nil)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}
}
