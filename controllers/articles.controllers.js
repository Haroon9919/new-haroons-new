const { fetchArticleById, fetchAllArticles, fetchCommentsByArticleId, updateArticleVotes} = require("../models/articleid.model");

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

const patchArticleVotes = (request, response, next) => {
  const { article_id } = request.params;
  let { inc_votes } = request.body;
  
  
  if (typeof inc_votes !== 'number') {
    return response.status(400).json({ msg: 'Invalid vote' });
  }

  Promise.all([fetchArticleById(article_id), updateArticleVotes(article_id, inc_votes)])
    .then((article) => {
   
      response.status(200).send({ article: article[1] });
    })
    .catch((err) => {
      next(err);
    });
};


  

module.exports = { getArticleById, getAllArticles, getCommentsByArticleId, patchArticleVotes };
