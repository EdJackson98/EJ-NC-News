const db = require("../db/connection");

exports.removeCommentByID = (comment_id) => {
  return db.query("DELETE FROM comments WHERE comment_id = $1;", [comment_id]);
};

exports.checkCommentExists = (comment_id) => {
  return db
    .query(`SELECT * FROM comments WHERE comment_id=$1;`, [comment_id])
    .then((result) => {
      const comment = result.rows[0];
      if (!comment) {
        return Promise.reject({
          status: 404,
          msg: `No comment found for comment id: ${comment_id}`,
        });
      }
      return comment;
    })
    .catch((err) => {
      throw err;
    });
};
