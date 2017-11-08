var betsApiController = require('../controllers/betsApi');

module.exports = function(app) {
  app.post('/bets', betsApiController.createBet);
  app.get('/active-bets', betsApiController.getActiveBets);
};
