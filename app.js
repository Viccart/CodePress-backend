const express = require("express");
const { getTopics } = require("./controllers/topics.controllers");
const { errorMessage } = require("./error");
const app = express();

app.get("/api/topics", getTopics);

app.all("/*", errorMessage);

module.exports = app;
