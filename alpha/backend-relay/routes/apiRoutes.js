let betsApiController = require('../controllers/betsApi');
let usersApiController = require('../controllers/usersApi');
let leaderboardApiController = require('../controllers/leaderboardApi');
let auth = require('../lib/authMiddleware');

module.exports = function (app) {
  app.post('/api/bets', auth, betsApiController.createBet);
  app.post('/api/bets/cancel', auth, betsApiController.cancelBet);
  app.post('/api/bets/call', auth, betsApiController.callBet);

  app.get('/api/bets/active', betsApiController.getActiveBets);
  app.get('/api/bets/executed', betsApiController.getExecutedBets);

  app.post('/api/users', auth, usersApiController.createUser);
  app.get('/api/users/:address', usersApiController.getUser);

  app.get('/api/leaderboard', leaderboardApiController.getLeaderboard);

};
