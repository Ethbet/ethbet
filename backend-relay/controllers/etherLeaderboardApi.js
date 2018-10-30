const _ = require('lodash');

let etherLeaderboardService = require('../lib/etherLeaderboardService');
let errorService = require('../lib/errorService');

module.exports = {

  getLeaderboard: async function getLeaderboard(req, res) {
    try {
      let leaderboard = await etherLeaderboardService.getLeaderboard();

      res.status(200).json({leaderboard: leaderboard});
    }
    catch (err) {
      res.status(500).json({message: errorService.sanitize(err).message});
    }
  },

};
