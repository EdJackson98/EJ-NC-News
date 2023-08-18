const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controller");
const {
  getArticleByID,
  getCommentsByArticle,
  getAllArticles,
  postCommentByArticle,
  updateArticleByID
} = require("./controllers/articles.controller");
const { getEndpoints } = require("./controllers/endpoints.controller");
const { getAllUsers } = require("./controllers/users.controller")
const { deleteCommentByID } = require('./controllers/comments.controller')


const {
  handleCustomErrors,
  handlePsqlErrors,
  handleServerErrors,
} = require("./errors/index.js");

app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndpoints);
app.get("/api/articles/:article_id", getArticleByID);
app.get("/api/articles", getAllArticles);
app.post("/api/articles/:article_id/comments", postCommentByArticle);
app.get("/api/articles/:article_id/comments", getCommentsByArticle);
app.patch('/api/articles/:article_id', updateArticleByID);
app.get('/api/users', getAllUsers)
app.delete("/api/comments/:comment_id", deleteCommentByID)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;
