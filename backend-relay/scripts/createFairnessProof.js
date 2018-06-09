let fairnessProofService = require('../lib/fairnessProofService');

console.log("running script in environment :", process.env.NODE_ENV);

global.db = require('../models');

async function run() {
  await fairnessProofService.create();

  process.exit(0);
}

run();