const crypto = require("crypto");

function generateSeed() {
  // 16 char length random string
  return crypto.randomBytes(8).toString('hex');
}

module.exports = {
  generateSeed: generateSeed
};