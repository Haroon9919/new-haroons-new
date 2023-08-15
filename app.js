const express = require("express");
const app = express();

const { getTopics } = require("./controllers/topics.controllers");
const getEndPoints = require("./controllers/api.controllers");

app.get("/api/topics", getTopics);


app.get("/api", getEndPoints)

app.use((err, req, res, next) => {
  res.status(500).send("Internal server error");
});

app.use((request, response) => {
  response.status(404).send("Not found");
});

module.exports = app;
