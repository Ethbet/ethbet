const seedrandom = require('seedrandom');

let cryptoService = require('../lib/cryptoService');
let fairnessProofService = require('../lib/fairnessProofService');


async function calculateRoll(rollInput) {
  let serverSeed = await fairnessProofService.getCurrentServerSeed();
  let serverSeedHash = cryptoService.generateSeedHashDigest(serverSeed);

  let fullSeed = this.generateFullSeed(rollInput.makerSeed, rollInput.callerSeed, serverSeed, rollInput.betId);

  let seedDigest = cryptoService.generateSeedHashDigest(fullSeed);

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



module.exports = {
  calculateRoll,
  generateFullSeed,
};
