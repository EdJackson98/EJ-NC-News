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

exports.fetchAllArticles = () => {
    let query = 'SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count FROM articles LEFT JOIN comments ON articles.article_id = comments.article_id GROUP BY articles.article_id ORDER BY articles.created_at DESC;'
    return db.query(query).then((result) => {
        return result.rows;
    })
}

exports.insertComment = (article_id, username, body) => {
    console.log(article_id, username, body, 'model')
        const query =
        `INSERT INTO comments (article_id, author, body) VALUES ($1,$2, $3) RETURNING *; `
        const values = [article_id, username, body];
        return db.query(query, values)
        .then((result) => {
            console.log(result.rows[0], 'model result')
            return result.rows[0];
        });
};

