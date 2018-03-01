let _ = require('lodash');

let socketService = require('./socketService');
let ethbetService = require('./ethbetService');
let userService = require('./userService');
let diceService = require('./diceService');
let lockService = require('./lockService');
let logService = require('./logService');

async function createBet(betData) {
  let userBalance = await ethbetService.balanceOf(betData.user);

  if (userBalance < betData.amount) {
    throw new Error("Insufficient Balance for bet");
  }

  let bet = await db.Bet.create(betData);

  logService.logger.info("New Bet, db updated: ", bet.toJSON());

  let results = await ethbetService.lockBalance(bet.user, bet.amount);

  logService.logger.info("New Bet, balance locked : ", {
    tx: results.tx,
    betId: bet.id,
    user: bet.user,
    amount: bet.amount
  });

  bet.dataValues.username = await userService.getUsername(bet.user);
  socketService.emit("betCreated", bet);

  return bet;
}

async function getActiveBets(opts = { orderField: 'createdAt', orderDirection: 'DESC', offset: 0 }) {
  let result = await db.Bet.findAndCountAll({
    where: {
      cancelledAt: null,
      executedAt: null,
    },
    order: [
      [opts.orderField, opts.orderDirection]
    ],
    offset: opts.offset,
    limit: 50
  });

  let populatedBets = await populateUserNames(result.rows);

  return { bets: populatedBets, count: result.count };
}

async function populateUserNames(bets) {
  let userAddresses = _.union(_.map(bets, 'user'), _.map(bets, 'callerUser'));
  let usernames = await userService.getUsernames(userAddresses);

  for (i = 0; i < bets.length; i++) {
    let bet = bets[i];
    // populate values
    bet.dataValues.username = usernames[bet.user];
    bet.dataValues.callerUsername = usernames[bet.callerUser];
  }

  return bets;
}

async function getExecutedBets() {
  let bets = await db.Bet.findAll({
    where: {
      executedAt: {
        [db.Sequelize.Op.ne]: null
      },
    },
    order: [
      ['executedAt', 'DESC']
    ],
    limit: 20
  });

  let populatedBets = await populateUserNames(bets);

  return populatedBets;
}


function getBetLockId(betId) {
  return `bet-${betId}`;
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

  try {
    await lockService.lock(getBetLockId(betId));
  }
  catch (err) {
    if (err.code === 'EEXIST') {
      throw new Error("Somebody else is currently calling or cancelling this bet ...");
    }
  }

  let results = await ethbetService.unlockBalance(bet.user, bet.amount);

  logService.logger.info("Bet Canceled, balance unlocked : ", {
    tx: results.tx,
    betId: bet.id,
    user: bet.user,
    amount: bet.amount
  });

  let cancelledAt = new Date();
  await bet.update({ cancelledAt });

  logService.logger.info("Bet Canceled, db updated : ", { betId: bet.id, cancelledAt });

  await lockService.unlock(getBetLockId(betId));

  socketService.emit("betCanceled", bet);

  return bet;
}

async function callBet(betId, callerSeed, callerUser) {
  let bet = await db.Bet.findById(betId);

  if (!bet) {
    throw new Error("Bet not found");
  }
  if (bet.cancelledAt) {
    throw new Error("Bet cancelled");
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

  try {
    await lockService.lock(getBetLockId(bet.id));
  }
  catch (err) {
    if (err.code === 'EEXIST') {
      throw new Error("Somebody else is currently calling or cancelling this bet ...");
    }
  }

  let rollInput = {
    makerSeed: bet.seed,
    callerSeed: callerSeed,
    betId: bet.id,
  };
  let rollResults = await diceService.calculateRoll(rollInput);

  let rollUnder = 50 + bet.edge / 2;
  let makerWon = (rollResults.roll <= rollUnder);

  let txResults = await ethbetService.executeBet(bet.user, callerUser, makerWon, bet.amount);
  logService.logger.info("Bet Called, contract updated : ", {
    tx: txResults.tx,
    betId: bet.id,
    makerUser: bet.user,
    callerUser,
    amount: bet.amount,
    makerWon
  });

  let dbUpdateAttrs = {
    executedAt: rollResults.executedAt,
    callerUser: callerUser,
    callerSeed: callerSeed,
    serverSeedHash: rollResults.serverSeedHash,
    roll: rollResults.roll,
    makerWon: makerWon
  };
  await bet.update(dbUpdateAttrs);
  logService.logger.info("Bet Called, db updated : ", Object.assign({}, bet.toJSON(), dbUpdateAttrs));

  await lockService.unlock(getBetLockId(bet.id));

  bet.dataValues.username = await userService.getUsername(bet.user);
  bet.dataValues.callerUsername = await userService.getUsername(bet.callerUser);
  socketService.emit("betCalled", bet);

  return {
    tx: txResults.tx,
    seedMessage: `We combined the makerSeed (${rollInput.makerSeed}), the callerSeed (${rollInput.callerSeed}) and the server seed (Hidden until next day), and the betID (${rollInput.betId}) in order to produce the fullSeed for the rolls`,
    resultMessage: `You rolled a ${Math.round(rollResults.roll * 100) / 100} (needed ${_.round(rollUnder, 4)}) and ${makerWon ? 'lost' : 'won'} ${bet.amount / 100} EBET!'`
  };
}


module.exports = {
  createBet,
  getActiveBets,
  getExecutedBets,
  cancelBet,
  callBet,
  populateUserNames
};