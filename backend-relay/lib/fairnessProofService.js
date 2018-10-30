const moment = require("moment");

let randomService = require('../lib/randomService');
let cryptoService = require('./cryptoService');
let fairnessProofService = require('../lib/fairnessProofService');

async function create() {
  let isDaySeedExists = await this.daySeedExists();
  if (isDaySeedExists) {
    throw new Error("Daily Server seed has already been generated");
  }

  let serverSeed = randomService.generateSeed();
  let serverSeedHash = cryptoService.generateSeedHashDigest(serverSeed);

  let fairnessProof = await db.FairnessProof.create({
    serverSeed,
    serverSeedHash,
  });

  return fairnessProof;
}

async function daySeedExists() {
  let count = await db.FairnessProof.count({
    where: getCurrentDayFilters()
  });

  return count > 0;
}

function getCurrentDayFilters() {
  return {
    createdAt: {
      [db.Sequelize.Op.gte]: moment().startOf("day").toDate(),
      [db.Sequelize.Op.lte]: moment().endOf("day").toDate(),
    }
  };
}

async function getCurrentServerSeed() {
  let fairnessProof = await db.FairnessProof.findOne({
    where: getCurrentDayFilters()
  });

  if (!fairnessProof) {
    throw new Error("Server Seed not generated");
  }

  return fairnessProof.serverSeed;
}


async function getFairnessProofs() {
  let fairnessProofs = await db.FairnessProof.findAll({
    where: {},
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 20
  });

  // hide current server seed
  if (fairnessProofs.length > 0) {
    fairnessProofs[0].serverSeed = null;
  }

  for (i = 0; i < fairnessProofs.length; i++) {
    fairnessProofs[i].dataValues.date = moment(fairnessProofs[i].createdAt).format("YYYY-MM-DD");
  }

  return fairnessProofs;
}


async function getSeedByHash(serverSeedHash) {
  let fairnessProof = await db.FairnessProof.findOne({
    where: { serverSeedHash }
  });

  let lastFairnessProof = (await db.FairnessProof.findAll({
    where: {},
    order: [
      ['createdAt', 'DESC']
    ],
    limit: 1
  }))[0];

  if (!fairnessProof) {
    throw new Error("Server Seed not found");
  }

  // do not provide the current seed
  if (lastFairnessProof.id === fairnessProof.id) {
    return null;
  }

  return fairnessProof.serverSeed;
}


module.exports = {
  getCurrentServerSeed,
  daySeedExists,
  create,
  getFairnessProofs,
  getSeedByHash
};