exports.errorMessage = (req, res) => {
  res.status(404).send({ msg: "Sorry, this endpoint does not exist" });
};
