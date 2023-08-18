const {
  removeCommentByID,
  checkCommentExists,
} = require("../models/comments.model");

exports.deleteCommentByID = (req, res, next) => {
  const { comment_id } = req.params;
  checkCommentExists(comment_id)
    .then(() => removeCommentByID(comment_id))
    .then(() => res.status(204).send())
    .catch((err) => {
      next(err);
    });
};
