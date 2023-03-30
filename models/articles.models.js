const db = require("../db/connection.js");

exports.selectArticle = (articleId) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [articleId])
    .then((article) => {
      if (article.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
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
    LEFT JOIN comments 
    ON articles.article_id = comments.article_id
    GROUP BY articles.article_id 
    ORDER BY created_at DESC;`
    )
    .then((result) => {
      return result.rows;
    });
};

exports.selectArticleCommentsById = (articleID) => {
  return db
    .query(
      `SELECT comment_id, votes, created_at, author, body, article_id
        FROM comments
          WHERE article_id = $1
          ORDER BY created_at DESC;`,
      [articleID]
    )
    .then((result) => {
      return result.rows;
    });
};

exports.checkArticleExists = (article_id) => {
  return db
    .query(
      `SELECT * FROM articles
                WHERE article_id = $1;`,
      [article_id]
    )
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      }
    });
};

exports.insertComment = (body) => {
  return db
    .query(
      `INSERT INTO comments (body, author, article_id)
          VALUES ($1, $2, $3) RETURNING *;`,
      [body.body, body.author, body.article_id]
    )
    .then((result) => {
      if ((result.rowCount = 0)) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      }
      return result.rows[0];
    });
};

exports.updateArticleVotes = (article_id, incValue) => {
  return db
    .query(`SELECT * FROM articles WHERE article_id = $1`, [article_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article id does not exist",
        });
      }
      const rows = result.rows;
      const oldArticle = rows[0];
      oldArticle.votes += incValue;
      return oldArticle;
    })
    .then((updatedArticle) => {
      return updatedArticle;
    });
};
