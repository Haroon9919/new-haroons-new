const db = require("../db/connection");
const fetchArticleById = (article_id) => {
  return db

    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])

    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Not Found" });
      }
      return rows[0];
    });
};

const fetchAllArticles = () => {
  return db
    .query(
      `SELECT articles.article_id, articles.title, articles.topic, articles.author, articles.created_at, articles.votes, articles.article_img_url, COUNT(comments.comment_id)::INT AS comment_counter
    FROM articles
    LEFT JOIN comments ON articles.article_id = comments.article_id
    GROUP BY articles.article_id
    ORDER BY articles.created_at DESC;`
    )
    .then(({ rows }) => {
      return rows;
    });
};

const fetchCommentsByArticleId = (article_id) => {
  return db
  .query(`SELECT *
  FROM comments
  WHERE article_id = $1
  ORDER BY created_at DESC`, [article_id])
  .then((body) => {
      const {rows} = body
      if (rows.length === 0) {
        return Promise.reject({ status: 404, msg: "Comment Doesnt Exist" });
      }
      return rows
  })
}

const updateArticleVotes = (article_id, inc_votes) => {

  const queryString = 
      `UPDATE articles
      SET votes = votes + ${inc_votes}
      WHERE article_id = ${article_id}
      RETURNING *;`
 
  return db.query(queryString)
  .then(result => {
      return result.rows[0];
  });
};
module.exports = { fetchAllArticles, fetchArticleById, fetchCommentsByArticleId, updateArticleVotes};
