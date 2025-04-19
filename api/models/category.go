package models

import "database/sql"


func InsertIntoCategoryPost(postId, categorieId int,db *sql.DB) error {
	query := "INSERT INTO PostCategory (ID_Post, ID_Category) VALUES (?,?)"
    _, err := db.Exec(query, postId, categorieId)
    if err!= nil {
        return err
    }
    return nil
}