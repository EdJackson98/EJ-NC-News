
const { fetchArticleByID, fetchAllArticles, insertComment } = require("../models/articles.model")

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleByID(article_id)
        .then((article) => {
        res.status(200).send({article});
        })
        .catch(next)

};

exports.getAllArticles = (req, res, next) => {
    fetchAllArticles()
    .then((articles) => {
        res.status(200).send({articles});
    })
    .catch(next)
};

exports.postCommentByArticle = (req, res, next) => {
    console.log(req.body);
    const { article_id } = req.params;
    const { username, body } = req.body;
    console.log(article_id, username, body);
    insertComment(article_id, username, body)
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

