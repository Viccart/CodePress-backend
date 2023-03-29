const {
  selectArticles,
  selectArticle,
  selectArticleCommentsById,
  checkArticleExists,
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

// FAILING CODE MAKING SECOND QUERY AFTER GETTING THE ARTICLES
// exports.getArticleCommentsById = (req, res, next) => {
//   const { article_id } = req.params;
//   selectArticleCommentsById(article_id)
//     .then((comments) => {
//       res.status(200).send({ comments });
//     })
//     .catch((err) => {
//       next(err);
//     });
// };
