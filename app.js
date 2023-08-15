const express = require("express");
const app = express();

const{ getTopics } = require("./controllers/topics.controller");
const{ getArticleByID } = require("./controllers/articles.controller")

const {
    handleCustomErrors,
    handlePsqlErrors,
    handleServerErrors,
  } = require('./errors/index.js');

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID)

app.use(handleCustomErrors);
app.use(handlePsqlErrors);
app.use(handleServerErrors);

module.exports = app;