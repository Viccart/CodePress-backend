const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
  getArticleCommentsById,
} = require("./controllers/articles.controllers");
const {
  handleInvalidPath,
  handlePSQLErrors,
  handleCustomErrors,
  handle500Errors,
} = require("./error");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleCommentsById);

app.all("/*", handleInvalidPath);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);
module.exports = app;
