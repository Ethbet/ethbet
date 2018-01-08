const crypto = require('crypto');
const seedrandom = require('seedrandom');

let fairnessProofService = require('../lib/fairnessProofService');


async function calculateRoll(rollInput) {
  let serverSeed = await fairnessProofService.getCurrentServerSeed();
  let serverSeedHash = this.generateSeedHashDigest(serverSeed);

  let fullSeed = this.generateFullSeed(rollInput.makerSeed, rollInput.callerSeed, serverSeed, rollInput.betId);

  let seedDigest = this.generateSeedHashDigest(fullSeed);

  let rng = seedrandom(seedDigest);
  let roll = rng() * 100;
  let executedAt = new Date();

  return {
    roll,
    executedAt,
    serverSeedHash
  }
}

function generateFullSeed(makerSeed, callerSeed, serverSeed, betId) {
  return makerSeed + callerSeed + serverSeed + betId;
}

function generateSeedHashDigest(seed) {
  const hash = crypto.createHash('sha512');
  hash.update(seed);
  return hash.digest('hex');
}

module.exports = {
  calculateRoll,
  generateFullSeed,
  generateSeedHashDigest : generateSeedHashDigest
};
