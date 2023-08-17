const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const getEndPoints = require("./controllers/api.controllers");
const getArticleId = require("./controllers/articles.controllers");

app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);
app.get("/api/articles/:article_id", getArticleId);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send(err.msg);
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.status===400 && err.msg==="Bad Request") {
    res.status(400).send("Bad Request");
  } else next(err);
});

app.use((err, req, res, next) => {
  console.log(err);
  res.status(500).send("Internal server error");
});

module.exports = app;
