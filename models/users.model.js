const db = require("../db/connection");

exports.fetchAllUsers = () => {
    const query = "SELECT * FROM users;";
    return db.query(query).then((result) => {
      return result.rows;
    });
  };