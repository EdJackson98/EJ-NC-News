const {
  fetchArticleByID,
  fetchAllArticles,
  fetchCommentsByArticle,
  checkIDExists,
  insertComment,
  updateArticleVotes
} = require("../models/articles.model");

exports.getArticleByID = (req, res, next) => {
  const { article_id } = req.params;
  fetchArticleByID(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.getAllArticles = (req, res, next) => {
  fetchAllArticles()
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
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

exports.getCommentsByArticle = (req, res, next) => {
  const { article_id } = req.params;
  checkIDExists(article_id)
    .then(() => fetchCommentsByArticle(article_id))
    .then((comments) => {
      if (comments.length === 0) {
        res
          .status(200)
          .send({ msg: `No comments found on article id: ${article_id}` });
      } else {
        res.status(200).send({ comments });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    const { inc_votes } = req.body;
    if (typeof inc_votes !== 'number') {
        return next({
            status: 400,
            msg: 'Invalid vote value. Please provide a valid number.'
        });
    }
    checkIDExists(article_id)
    .then(() => updateArticleVotes(article_id, inc_votes))
    .then((updatedArticle) => {
        res.status(200).send({ article: updatedArticle})
    })
    .catch(next)
};