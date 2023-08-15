const express = require("express");
const app = express();

const{ getTopics } = require("./controllers/topics.controller");
const endpointController = require('./controllers/endpoints.controller');

app.get("/api/topics", getTopics);
app.get('/api', endpointController.getApiInfo);

app.use((err, request, response, next) =>{
    if(err.status===500){
      response.status(500).send({ msg: 'Internal Server Error' })
    }
  })

module.exports = app;