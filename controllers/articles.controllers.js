const {
  selectArticles,
  selectArticle,
  selectArticleCommentsById,
  checkArticleExists,
  insertComment,
  updateArticleVotes,
} = require("../models/articles.models");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;
  selectArticle(article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
  selectArticles().then((articles) => {
    res.status(200).send({ articles });
  });
};

exports.getArticleCommentsById = (req, res, next) => {
  const { article_id } = req.params;

  const articlePromises = [
    selectArticleCommentsById(article_id),
    checkArticleExists(article_id),
  ];

  Promise.all(articlePromises)
    .then(([comments]) => {
      res.status(200).send({ comments });
    })
    .catch((err) => {
      next(err);
    });
};

exports.postNewCommentToArticleID = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;

  const commentToAdd = { body: body.body, author: body.username, article_id };
  insertComment(commentToAdd)
    .then((newComment) => {
      res.status(201).send(newComment);
    })
    .catch((err) => {
      next(err);
    });
};

exports.editArticle = (req, res, next) => {
  const { article_id } = req.params;
  const { body } = req;
  const incValue = body.inc_votes;

  updateArticleVotes(article_id, incValue)
    .then((updatedArticle) => {
      res.status(200).send(updatedArticle);
    })
    .catch((err) => {
      next(err);
    });
};
