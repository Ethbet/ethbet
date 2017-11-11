const _ = require('lodash');

let betService = require('../lib/betService');


module.exports = {
  getActiveBets: async function (req, res) {
    try {
      let bets = await betService.getActiveBets();
      res.status(200).json({bets});
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

  createBet: async function (req, res) {
    try {
      let betData = {
        amount: req.objectData.amount,
        edge: req.objectData.edge,
        user: req.objectData.user,
        seed: req.objectData.seed,
      };

      let bet = await betService.createBet(betData);

      res.status(200).json({bet});
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

};
