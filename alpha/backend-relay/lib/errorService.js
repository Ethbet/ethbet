const _ = require('lodash');

function sanitize(err) {
  if (err.name === "SequelizeDatabaseError") {
    console.log("[DB Error]", err.message);
    err.message = "Database Error";
  }
  return err;
}

module.exports = {
  sanitize
};