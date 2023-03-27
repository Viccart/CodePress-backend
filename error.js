exports.errorMessage = (req, res) => {
  res.status(404).send({ msg: "Page not found" });
};
