let socketService = require('../lib/socketService');

async function createBet(betData) {
  let bet = await db.Bet.create(betData);

  socketService.emit("betCreated", bet);

  return bet;
}

async function getActiveBets() {
  let bets = await db.Bet.findAll({
    where: {
      cancelledAt: null,
      executedAt: null,
    },
    order: [
      ['createdAt', 'DESC']
    ]
  });

  return bets;
}

module.exports = {
  createBet: createBet,
  getActiveBets: getActiveBets
};