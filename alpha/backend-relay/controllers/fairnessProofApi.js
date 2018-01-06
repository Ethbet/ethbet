const _ = require('lodash');

let fairnessProofService = require('../lib/fairnessProofService');
let errorService = require('../lib/errorService');

module.exports = {

  getFairnessProofs: async function getFairnessProofs(req, res) {
    try {
      let fairnessProofs = await fairnessProofService.getFairnessProofs();

      res.status(200).json({fairnessProofs: fairnessProofs});
    }
    catch (err) {
      res.status(500).json({message: errorService.sanitize(err).message});
    }
  },

};
