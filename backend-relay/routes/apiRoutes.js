let betsApiController = require('../controllers/betsApi');
let usersApiController = require('../controllers/usersApi');
let leaderboardApiController = require('../controllers/leaderboardApi');
let fairnessProofApiController = require('../controllers/fairnessProofApi');

let etherBetsApiController = require('../controllers/etherBetsApi');


let auth = require('../lib/authMiddleware');

module.exports = function (app) {
  // EBET bets routes
  app.post('/api/bets', auth, betsApiController.createBet);
  app.post('/api/bets/cancel', auth, betsApiController.cancelBet);
  app.post('/api/bets/call', auth, betsApiController.callBet);

  app.get('/api/bets/active', betsApiController.getActiveBets);
  app.get('/api/bets/executed', betsApiController.getExecutedBets);

  app.post('/api/users', auth, usersApiController.createUser);
  app.get('/api/users/:address', usersApiController.getUser);

  app.get('/api/leaderboard', leaderboardApiController.getLeaderboard);

  app.get('/api/fairness-proofs', fairnessProofApiController.getFairnessProofs);

  // ETH bets routes
  app.post('/api/ether-bets', auth, etherBetsApiController.createBet);
  app.post('/api/ether-bets/cancel', auth, etherBetsApiController.cancelBet);

  app.get('/api/ether-bets/active', etherBetsApiController.getActiveBets);
  app.get('/api/ether-bets/executed', etherBetsApiController.getExecutedBets);

};
