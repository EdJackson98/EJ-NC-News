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
    return db.query(`SELECT * FROM articles;`)
}