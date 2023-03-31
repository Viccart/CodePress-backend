const { removeComment } = require("../models/comments.models");

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;

  removeComment(comment_id)
    .then((result) => {
      res.status(204).send(result);
    })
    .catch((err) => {
      next(err);
    });
};
