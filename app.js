const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const {
  getArticleById,
  getArticles,
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

app.all("/*", handleInvalidPath);

app.use(handlePSQLErrors);
app.use(handleCustomErrors);
app.use(handle500Errors);
module.exports = app;

// Responds with:

// an articles array of article objects, each of which should have the following properties:
// author --
// title --
// article_id --
// topic --
// created_at --
// votes --
// article_img_url --
// comment_count which is the total count of all the comments with this article_id - you should make use of queries to the database in order to achieve this.
// the articles should be sorted by date in descending order.

//NOT BODY
