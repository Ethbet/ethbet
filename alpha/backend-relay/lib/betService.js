let socketService = require('../lib/socketService');
let ethbetService = require('../lib/ethbetService');

async function createBet(betData) {
  let userBalance = await ethbetService.balanceOf(betData.user);

  if (userBalance < betData.amount) {
    throw new Error("Insufficient Balance for bet");
  }

  let bet = await db.Bet.create(betData);

  let results = await ethbetService.lockBalance(bet.user, bet.amount);

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