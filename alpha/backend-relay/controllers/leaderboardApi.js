const _ = require('lodash');

let leaderboardService = require('../lib/leaderboardService');

module.exports = {

  getLeaderboard: async function getLeaderboard(req, res) {
    try {
      let leaderboard = await leaderboardService.getLeaderboard();

      res.status(200).json({leaderboard: leaderboard});
    }
    catch (err) {
      res.status(500).json({message: err.message});
    }
  },

};
