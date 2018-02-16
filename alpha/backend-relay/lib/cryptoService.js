const crypto = require('crypto');

function generateSeedHashDigest(seed) {
  const hash = crypto.createHash('sha512');
  hash.update(seed);
  return hash.digest('hex');
}

module.exports = {
  generateSeedHashDigest : generateSeedHashDigest
};
