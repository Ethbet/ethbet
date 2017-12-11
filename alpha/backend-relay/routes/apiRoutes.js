let betsApiController = require('../controllers/betsApi');
let usersApiController = require('../controllers/usersApi');
let auth = require('../lib/authMiddleware');

module.exports = function (app) {
  app.post('/bets', auth, betsApiController.createBet);
  app.post('/bets/cancel', auth, betsApiController.cancelBet);
  app.post('/bets/call', auth, betsApiController.callBet);

  app.get('/bets/active', betsApiController.getActiveBets);
  app.get('/bets/executed', betsApiController.getExecutedBets);

  app.post('/users', auth, usersApiController.createUser);
  app.get('/users/:address', usersApiController.getUser);

};
