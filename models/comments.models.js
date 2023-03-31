const db = require("../db/connection.js");

exports.removeComment = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id = $1`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({
          status: 404,
          msg: "Comment id does not exist",
        });
      }
      return result;
    });
};
