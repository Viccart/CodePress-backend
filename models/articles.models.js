const db = require("../db/connection.js");

exports.selectArticle = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((article) => {
      if (article.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article does not exist",
        });
      }
      return article.rows[0];
    });
};
