exports.handleInvalidPath = (req, res) => {
  res.status(404).send({ msg: "Sorry, this endpoint does not exist" });
};

exports.handle404Errors = (err, req, res, next) => {
  if (err.code === "22P02") {
    res.status(400).send({ msg: "Sorry, this is not a valid article id" });
  } else {
    next(err);
  }
};

exports.handleCustomErrors = (err, req, res, next) => {
  const { status, msg } = err;
  if (status && msg) {
    res.status(status).send({ msg });
  }
};
