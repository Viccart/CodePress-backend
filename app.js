const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { getArticleById } = require("./controllers/articles.controllers");
const {
  handleInvalidPath,
  handle404Errors,
  handleCustomErrors,
  handle500Errors,
} = require("./error");
const app = express();

app.get("/api/topics", getTopics);
app.get("/api/articles/:article_id", getArticleById);

app.all("/*", handleInvalidPath);

app.use(handle404Errors);
app.use(handleCustomErrors);
app.use(handle500Errors);
module.exports = app;
