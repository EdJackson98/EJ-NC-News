const db = require("../db/connection")

exports.fetchArticleByID = (article_id) => {
    return db
        .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
        .then((result) => {
            const article = result.rows[0]
            if(!article){
                return Promise.reject({
                    status: 404,
                    msg: `Article ID not found`
                })
            }
        return article
        });
}

exports.fetchCommentsByArticle = (article_id) => {
    return db
        .query(`SELECT * FROM comments WHERE comments.article_id=$1 ORDER BY created_at ASC`, [article_id])
        .then((result) => {
            const comments = result.rows
            if(comments.length === 0){
                return Promise.reject({
                    status: 404,
                    msg: `No article found for article id: ${article_id}`
                })
            }
        return comments
        });
}