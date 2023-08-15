
const fetchArticleId = () => {
     const sqlText = "SELECT article_id FROM articles";
        return db.query(sqlText)
        .then(({rows})=>{
          return rows
         
        })
      };


module.exports = fetchArticleId