const { fetchArticleByID } = require("../models/articles.model")

exports.getArticleByID = (req, res, next) => {
    const { article_id } = req.params;
    fetchArticleByID(article_id)
        .then((article) => {
        if(!article){
            return res.status(404).json({ msg: 'Not found'})
        }
        res.status(200).send({article});
        })
        .catch(next)
};