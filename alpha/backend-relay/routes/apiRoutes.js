var betsApiController = require('../controllers/betsApi');
var auth = require('../lib/authMiddleware');

module.exports = function(app) {
  app.post('/bets', auth, betsApiController.createBet);
  app.get('/bets/active', betsApiController.getActiveBets);
};
