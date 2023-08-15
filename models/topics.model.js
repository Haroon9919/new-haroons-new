const db = require("../db/connection");

const fetchTopics = () => {
  const sqlText = "SELECT * FROM topics";
  return db.query(sqlText)
  .then(({rows})=>{
    return rows
   
  })
};


module.exports = {fetchTopics}