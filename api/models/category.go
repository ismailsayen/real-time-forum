package models

import "database/sql"

type Category struct {
	ID   int    `json:"id"`
	Name string `json:"name"`
}

func InsertIntoCategoryPost(postId, categorieId int, db *sql.DB) error {
	query := "INSERT INTO PostCategory (ID_Post, ID_Category) VALUES (?,?)"
	_, err := db.Exec(query, postId, categorieId)
	if err != nil {
		return err
	}
	return nil
}

func DisplayCategory(db *sql.DB) ([]Category, error)  {

	query := "SELECT ID, Name_Category FROM Category"
	rows, err := db.Query(query)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	var categories []Category
	for rows.Next() {
		var category Category
		err = rows.Scan(&category.ID, &category.Name)
		if err != nil {
			return nil, err
		}
		categories = append(categories, category)
	}
	return categories, nil

}
