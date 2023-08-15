const express = require("express");
const app = express();

const{ getTopics } = require("./controllers/topics.controller");
const{ getArticleByID } = require("./controllers/articles.controller")

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleByID)

app.use((err, request, response, next) =>{
    if(err.status===400){
      response.status(400).send({msg: 'Invalid input'})
    }
    if(err.status===404){
        response.status(404).send({msg: 'Not found'})
    }
    if(err.status===500){
        response.status(500).send({msg: 'Internal server error'})
    }
  })

module.exports = app;