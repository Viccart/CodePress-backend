exports.handleInvalidPath = (req, res) => {
  res.status(404).send({ msg: "Endpoint does not exist" });
};

exports.handlePSQLErrors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Invalid id" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_article_id_fkey"
  ) {
    res.status(404).send({ msg: "Article id does not exist" });
  } else if (
    err.code === "23503" &&
    err.constraint === "comments_author_fkey"
  ) {
    res.status(404).send({ msg: "Username does not exist" });
  } else if (err.code === "23502") {
    res.status(400).send({ msg: "Missing required field(s)" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status && msg) {
    res.status(status).send({ msg });
  } else {
    next(err);
  }
};

exports.handle500Errors = (err, req, res, next) => {
  if (err) console.log(err), res.status(500).send({ err }); // debugging 500s
};
