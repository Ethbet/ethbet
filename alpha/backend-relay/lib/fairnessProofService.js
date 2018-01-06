const moment = require("moment");

let randomService = require('../lib/randomService');
let diceService = require('../lib/diceService');


async function create() {
  let isDaySeedExists = await this.daySeedExists();
  if (isDaySeedExists) {
    throw new Error("Daily Server seed has already been generated");
  }

  let serverSeed = randomService.generateSeed();
  let serverSeedHash = diceService.generateSeedHashDigest();

  let fairnessProof = await db.FairnessProof.create({
    serverSeed,
    serverSeedHash,
    published: false
  });
}

async function daySeedExists() {
  let count = await db.FairnessProof.count({
    where: {
      createdAt: {
        [db.Sequelize.Op.gte]: moment().startOf("day").toDate(),
        [db.Sequelize.Op.lte]: moment().endOf("day").toDate(),
      }
    }
  });

  return count > 0;
}

module.exports = {
  daySeedExists: daySeedExists,
  create: create
};