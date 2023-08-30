const db = require("../db/connection");
const format = require("pg-format")


const postComment = (article_id, username, body )=>{ 
    const qry = format(
      `INSERT INTO comments (article_id, author, body) VALUES %L RETURNING *;`, [[article_id, username,body]]
    );  
    return db.query(qry).then((body)=>{
      const {rows} = body
      return rows
    })

    }



    module.exports = {postComment}
