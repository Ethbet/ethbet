var betsApiController = require('../controllers/betsApi');

module.exports = function(app) {
  app.post('/bets', betsApiController.createBet);
  app.get('/bets', betsApiController.getBets);
};
