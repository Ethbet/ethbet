var betsApiController = require('../controllers/betsApi');
var auth = require('../lib/authMiddleware');

module.exports = function (app) {
  app.post('/bets', auth, betsApiController.createBet);
  app.post('/bets/cancel', auth, betsApiController.cancelBet);
  app.post('/bets/call', auth, betsApiController.callBet);

  app.get('/bets/active', betsApiController.getActiveBets);
  app.get('/bets/executed', betsApiController.getExecutedBets);
};
