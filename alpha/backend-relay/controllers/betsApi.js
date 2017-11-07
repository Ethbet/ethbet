let _ = require('lodash');

let betService = require('../lib/betService');

module.exports = {
  getBets: async function (req, res) {
    try {
      let bets = await betService.getBets();
      res.status(200).json({bets});
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

  createBet: async function (req, res) {
    try {
      let betData = {
        amount : req.body.amount,
        edge : req.body.edge,
        user : req.body.user,
      };

      let bet = await betService.createBet(betData);

      res.status(200).json({bet});
    }
    catch (err) {
      res.status(500).json(err);
    }
  },

};
