const express = require("express");
const app = express();
const { getTopics } = require("./controllers/topics.controllers");
const getEndPoints = require("./controllers/api.controllers");
const {getArticleById, getAllArticles, getCommentsByArticleId, patchArticleVotes} = require("./controllers/articles.controllers");
const {postCommentById} = require("./controllers/comments.controllers")
const cors = require('cors');

app.use(cors());


app.use(express.json());

app.get("/api/topics", getTopics);
app.get("/api", getEndPoints);
app.get("/api/articles", getAllArticles)
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles/:article_id/comments", getCommentsByArticleId)
app.post('/api/articles/:article_id/comments', postCommentById)
app.patch('/api/articles/:article_id', patchArticleVotes);

app.use((err, req, res, next) => {
  if (err.status && err.msg) {
    res.status(err.status).send({ msg: err.msg });
  } else next(err);
});

app.use((err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid Input" });
  } else next(err);
});

app.use((err, req, res, next) => {
  res.status(500).send({ msg: "Internal server error" });
});

module.exports = app;

