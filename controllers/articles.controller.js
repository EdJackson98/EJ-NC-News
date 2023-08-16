
const { fetchArticleByID, fetchAllArticles, fetchCommentsByArticle, checkIDExists } = require("../models/articles.model")

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

// exports.getCommentsByArticle = (req, res, next) => {
//     const { article_id } = req.params;
//     fetchCommentsByArticle(article_id)
//       .then((comments) => {
//         if (comments.length === 0) {
//           return res.status(200).send({ message: `No comments found on article id: ${article_id}` });
//         }
//         res.status(200).send({ comments });
//       })
//       .catch(next);
//   };

  exports.getCommentsByArticle = (req, res, next) => {
    const { article_id } = req.params;
    checkIDExists(article_id)
        .then(() => fetchCommentsByArticle(article_id))
        .then((comments) => {
            if (comments.length === 0) {
                res.status(200).send({ msg: `No comments found on article id: ${article_id}`});
            } else {
                res.status(200).send({ comments });
            }
        })
      .catch((err) => {
        next(err)
      });
  };

