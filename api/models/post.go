package models

import (
	"database/sql"
	"rtFroum/database"
)

func CreatePost(title string, content string, create_at int, userId int, db *sql.DB) (int, error) {
	query := "INSERT INTO posts (Title, User_id, Content, Create_at) VALUES (?, ?, ? , ?)"
	stm1, err := db.Prepare(query)
	if err != nil {
		return 0, err
	}
	defer stm1.Close()

	res, err := stm1.Exec(title, userId, content, create_at)
	if err != nil {
		return 0, err
	}
	id, err := res.LastInsertId()
	if err != nil {
		return 0, err
	}
	return int(id), nil
}

func GetPosts(db *sql.DB) ([]database.Posts, error) {
	query := `
    SELECT p.ID, p.User_id, p.title, p.Content, GROUP_CONCAT(c.Name_Category) AS categories, p.Create_at, u.Nickname
    FROM posts p
    INNER JOIN users u ON p.User_id = u.ID
    INNER JOIN PostCategory pc ON p.ID = pc.ID_Post
    INNER JOIN Category c ON pc.ID_Category = c.ID
    GROUP BY p.ID
    ORDER BY p.Create_at DESC;
    `
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var posts []database.Posts
	for rows.Next() {
		var post database.Posts
		var categorie string
		err = rows.Scan(&post.ID, &post.UserID, &post.Title, &post.Content, &categorie, &post.CreatedAt, &post.NickName)
		if err != nil {
			return nil, err
		}
		post.Categories = append(post.Categories, categorie)
		posts = append(posts, post)
	}
	return posts, nil
}
