const fetchArticleById = require("../models/articleid.model");
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
module.exports = getArticleById;
