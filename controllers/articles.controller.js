
const { fetchArticleByID, fetchAllArticles, insertComment, checkIDExists } = require("../models/articles.model")

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
    const { article_id } = req.params;
    const { username, body } = req.body;
    checkIDExists(article_id)
        .then(() => insertComment(article_id, username, body))
        .then((comment) => {
            res.status(201).send({ comment });
        })
        .catch(next);
};

