const db = require("../db/connection.js");

exports.selectArticle = (articleId) => {
  return db
    .query(
      `SELECT *, CAST ((SELECT COUNT(*) FROM articles WHERE article_id = $1) as INT) AS comment_count
    FROM articles WHERE article_id = $1
    GROUP BY articles.article_id;`,
      [articleId]
    )
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

exports.selectArticles = (topic, sortBy = "created_at", orderBy = "desc") => {
  if (
    sortBy &&
    sortBy !== "title" &&
    sortBy !== "topic" &&
    sortBy !== "author" &&
    sortBy !== "body" &&
    sortBy !== "created_at" &&
    sortBy !== "votes" &&
    sortBy !== "article_img_url"
  ) {
    return Promise.reject({ status: 400, msg: "Invalid Sort Query" });
  }
  if (orderBy && orderBy !== "asc" && orderBy !== "desc") {
    return Promise.reject({ status: 400, msg: "Invalid Order Query" });
  }
  let selectArticlesQueryString = `SELECT articles.author, articles.title, articles.article_id, articles.topic, articles.created_at, articles.votes, articles.article_img_url, CAST (COUNT(comment_id) AS INT) AS comment_count
  FROM articles LEFT JOIN comments 
  ON articles.article_id = comments.article_id`;
  const queryParameters = [];

  if (topic) {
    selectArticlesQueryString += ` WHERE topic = $1`;
    queryParameters.push(topic);
  }
  selectArticlesQueryString += `   GROUP BY articles.article_id`;

  if (sortBy) {
    selectArticlesQueryString += ` ORDER BY ${sortBy}`;
  }
  if (orderBy) {
    selectArticlesQueryString += ` ${orderBy}`;
  }

  return db.query(selectArticlesQueryString, queryParameters).then((result) => {
    return result.rows;
  });
};

exports.checkTopicExists = (topic) => {
  return db
    .query(
      `SELECT * FROM topics
                WHERE slug = $1;`,
      [topic]
    )
    .then((result) => {
      if (topic && result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Topic does not exist",
        });
      }
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
      } else if (!incValue) {
        return Promise.reject({
          status: 400,
          msg: "Missing input property",
        });
      } else if (isNaN(incValue)) {
        return Promise.reject({
          status: 400,
          msg: "Invalid votes input",
        });
      }
      const rows = result.rows;
      const oldArticle = rows[0];
      const newVotes = oldArticle.votes + incValue;
      return db
        .query(
          `UPDATE articles SET votes = $1 WHERE article_id = $2 RETURNING *`,
          [newVotes, article_id]
        )
        .then((result) => {
          const updatedArticle = result.rows[0];
          return { article: updatedArticle };
        });
    });
};
