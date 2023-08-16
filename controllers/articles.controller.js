
const { fetchArticleByID, fetchAllArticles, fetchCommentsByArticle } = require("../models/articles.model")

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

exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    fetchCommentsByArticle(article_id)
        .then((comments) => {
        res.status(200).send({comments});
        })
        .catch(next)
};

