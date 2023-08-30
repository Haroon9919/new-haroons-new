const { fetchArticleById, fetchAllArticles, fetchCommentsByArticleId } = require("../models/articleid.model");

const getArticleById = (request, response, next) => {
  const iD = request.params.article_id;
  fetchArticleById(iD)
    .then((article) => {
      response.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

const getAllArticles = (request, response, next) => {
  fetchAllArticles()
    .then((articles) => {
      response.status(200).send({ articles });
    })
    .catch((err) => {
      next(err);
    });
};

const getCommentsByArticleId = (request, response, next) => {
  const { article_id } = request.params;
  fetchCommentsByArticleId(article_id) 
    .then((comments) => {
      response.status(200).send(comments);
    })
    .catch(next);
};


module.exports = { getArticleById, getAllArticles, getCommentsByArticleId };
