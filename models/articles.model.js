const db = require("../db/connection");

exports.fetchArticleByID = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `Article ID not found`,
        });
      }
      return article;
    });
};

exports.fetchCommentsByArticle = (article_id) => {
  return db
    .query(
      `SELECT * FROM comments WHERE comments.article_id=$1 ORDER BY created_at ASC`,
      [article_id]
    )
    .then((result) => {
      const comments = result.rows;
      return comments;
    });
};

exports.checkIDExists = (article_id) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id=$1;`, [article_id])
    .then((result) => {
      const article = result.rows[0];
      if (!article) {
        return Promise.reject({
          status: 404,
          msg: `No article found for article id: ${article_id}`,
        });
      }
    });
};

const checkTopicExists = (topic) => {
  return db
  .query(`SELECT * FROM topics WHERE slug=$1;`, [topic])
  .then((result) => {
    const topic = result.rows[0];
    if (!topic) {
      return Promise.reject({
        status: 404,
        msg: `Topic not found`,
      });
    }
  })
}

exports.fetchAllArticles = (sort_by = 'created_at', order = 'desc', topic) => {
  const queryValues = [];
  const allowedSortColumns = ['created_at', 'votes'];
  const allowedOrders = ['asc', 'desc'];
  let queryStr =
    `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.article_id) AS comment_count
    FROM articles 
    LEFT JOIN comments ON articles.article_id = comments.article_id`;

  if (topic) {
      return checkTopicExists(topic)
      .then(() => {
        queryValues.push(topic)
        queryStr += ` WHERE articles.topic = $1 
        GROUP BY articles.article_id
        ORDER BY ${sort_by} ${order};`;
        return db.query(queryStr, queryValues)
      })
      .then((result) => {
        return result.rows
      })
  }

  if (!allowedSortColumns.includes(sort_by) || !allowedOrders.includes(order)) {
    return Promise.reject({ status: 400, msg: 'Bad request' });
  }

  queryStr += `
    GROUP BY articles.article_id
    ORDER BY ${sort_by} ${order}`;

  return db.query(queryStr, queryValues).then((result) => {
    return result.rows;
  });
};

exports.insertComment = (article_id, username, body) => {
  const query = `INSERT INTO comments (article_id, author, body) VALUES ($1,$2, $3) RETURNING *; `;
  const values = [article_id, username, body];
  return db.query(query, values).then((result) => {
    return result.rows[0];
  });
};

exports.updateArticleVotes = (article_id, inc_votes) => {
  return db
    .query(
      `UPDATE articles
              SET votes = votes + $1
              WHERE article_id = $2
              RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      const updatedArticle = result.rows[0];
      return updatedArticle;
    });
};
