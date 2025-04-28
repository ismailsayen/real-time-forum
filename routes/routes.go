package routes

import (
	"database/sql"
	"net/http"

	"rtFroum/api/handlers"
	"rtFroum/api/handlers/auth"
	"rtFroum/api/handlers/ws"
	"rtFroum/middleware"
)

func Routers(db *sql.DB) {
	http.HandleFunc("/login", func(w http.ResponseWriter, r *http.Request) {
		auth.Login(w, r, db)
	})
	http.HandleFunc("/register", func(w http.ResponseWriter, r *http.Request) {
		auth.Register(w, r, db)
	})

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		handlers.HomeHandler(w, r, db)
	})

	http.HandleFunc("/logout", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			auth.LogoutController(w, r, db)
		}), db).ServeHTTP(w, r)
	})

	http.HandleFunc("/addComment", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.CommentHandler(w, r, db)
		}), db).ServeHTTP(w, r)
	})

	http.HandleFunc("/addPost", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.AddPost(w, r, db)
		}), db).ServeHTTP(w, r)
	})

	http.HandleFunc("/getCategory", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.GetCategory(w, r, db)
		}), db).ServeHTTP(w, r)
	})

	http.HandleFunc("/Getposts", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.PostHundler(w, r, db)
		}), db).ServeHTTP(w, r)
	})
	http.HandleFunc("/sendMessage", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.SendMessage(w, r, db)
		}), db).ServeHTTP(w, r)
	})

	http.HandleFunc("/getComment", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.FetchComment(w, r, db)
		}), db).ServeHTTP(w, r)
	})

	http.HandleFunc("/getMessages", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.GetMessages(w, r, db)
		}), db).ServeHTTP(w, r)
	})
	http.HandleFunc("/getUsers", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			handlers.GetUsers(w, r, db)
		}), db).ServeHTTP(w, r)
	})
	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		middleware.Authorization(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
			ws.WebSocket(w, r, db)
		}), db).ServeHTTP(w, r)
	})
	http.HandleFunc("/isLog", func(w http.ResponseWriter, r *http.Request) {
		middleware.VerifyCookie(w, r, db)
	})
	http.HandleFunc("/static/", handlers.Static)
}
