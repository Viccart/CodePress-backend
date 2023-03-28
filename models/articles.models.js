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

exports.selectArticles = () => {
  return db
    .query(
      `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT(comment_id) AS INT) AS comment_count
    FROM articles 
    JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};
