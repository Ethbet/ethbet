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

async function cancelBet(betId, user) {
  let bet = await db.Bet.findById(betId);

  if (!bet) {
    throw new Error("Bet not found");
  }
  if (bet.cancelledAt) {
    throw new Error("Bet already cancelled");
  }
  if (bet.executedAt) {
    throw new Error("Bet already called");
  }
  if (bet.user !== user) {
    throw new Error("You can't cancel someone else's bet");
  }

  let lockedUserBalance = await ethbetService.lockedBalanceOf(user);

  if (lockedUserBalance < bet.amount) {
    throw new Error("Locked Balance is less than bet amount, please contact support");
  }

  await bet.update({cancelledAt: new Date()});

  let results = await ethbetService.unlockBalance(bet.user, bet.amount);

  socketService.emit("betCanceled", bet);

  return bet;
}

module.exports = {
  createBet: createBet,
  getActiveBets: getActiveBets,
  cancelBet: cancelBet,
};