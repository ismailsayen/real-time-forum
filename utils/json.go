package utils

import (
	"encoding/json"
	"net/http"
)

func Marshal(w http.ResponseWriter, data any, status int) ([]byte, error) {
	j, err := json.Marshal(&data)
	w.Header().Set("content-type","application/json")
	w.WriteHeader(status)
	if err != nil {
		return nil, err
	}
	return j, nil
}
