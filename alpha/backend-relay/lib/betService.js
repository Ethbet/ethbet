let socketService = require('../lib/socketService');
let ethbetService = require('../lib/ethbetService');
let diceService = require('../lib/diceService');
let randomService = require('../lib/randomService');

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
    throw new Error("Locked Balance is less than bet amount");
  }

  await bet.update({cancelledAt: new Date()});

  let results = await ethbetService.unlockBalance(bet.user, bet.amount);

  socketService.emit("betCanceled", bet);

  return bet;
}

async function callBet(betId, callerSeed, callerUser) {
  //TODO: add Mutex
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
  if (bet.user === callerUser) {
    throw new Error("You can't call your own bet");
  }

  let callerUserBalance = await ethbetService.balanceOf(callerUser);
  if (callerUserBalance < bet.amount) {
    throw new Error("Insufficient Balance for bet");
  }

  let lockedMakerUserBalance = await ethbetService.lockedBalanceOf(bet.user);
  if (lockedMakerUserBalance < bet.amount) {
    throw new Error("Maker user Locked Balance is less than bet amount");
  }

  let rollInput = {
    makerSeed: bet.seed,
    callerSeed: callerSeed,
    serverSeed: randomService.generateSeed(),
    edge: bet.edge,
    betId: bet.id,
  };
  let rollResults = diceService.calculateRoll(rollInput);
  let makerWon = (rollResults.roll <= rollResults.rollUnder);

  await bet.update({
    executedAt: new Date(),
    callerUser: callerUser,
    callerSeed: callerSeed,
    serverSeed: rollInput.serverSeed,
    fullSeed: rollResults.fullSeed,
    roll: rollResults.roll,
    makerWon: makerWon
  });

  let txResults = await ethbetService.executeBet(bet.user, callerUser, makerWon, bet.amount);

  socketService.emit("betCalled", bet);

  return bet;
}


module.exports = {
  createBet: createBet,
  getActiveBets: getActiveBets,
  cancelBet: cancelBet,
  callBet: callBet,
};