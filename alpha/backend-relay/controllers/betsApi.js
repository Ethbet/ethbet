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
        seed: req.objectData.seed,
        user: req.body.address,
      };

      let bet = await betService.createBet(betData);

      res.status(200).json({bet});
    }
    catch (err) {
      res.status(500).json({message: err.message});
    }
  },

};
