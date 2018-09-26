let _ = require('lodash');

let socketService = require('./socketService');
let ethbetService = require('./blockchain/ethbetService');
let userService = require('./userService');
let diceService = require('./diceService');
let fairnessProofService = require('./fairnessProofService');
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

  let populatedBets = await userService.populateUserNames(result.rows);

  return { bets: populatedBets, count: result.count };
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

  let populatedBets = await userService.populateUserNames(bets);

  return populatedBets;
}

async function getBetInfo(betId) {
  let bet = await db.Bet.findById(betId);

  // check if bet executed
  if (bet.serverSeedHash) {
    let serverSeed = await fairnessProofService.getSeedByHash(bet.serverSeedHash);
    bet.dataValues.serverSeed = serverSeed;
  }

  let populatedBets = await userService.populateUserNames([bet]);
  return populatedBets[0];
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

  let cancelledAt = new Date();
  await bet.update({ cancelledAt });
  logService.logger.info("cancelBet: pre-tx db updated", { betId: bet.id, cancelledAt });

  let results = await ethbetService.unlockBalance(bet.user, bet.amount);

  logService.logger.info("cancelBet: balance unlocked", {
    tx: results.tx,
    betId: bet.id,
    user: bet.user,
    amount: bet.amount
  });

  await bet.update({ txHash: results.tx, txSuccess: true });
  logService.logger.info("cancelBet: post-tx db updated", { betId: bet.id, cancelledAt });

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

  logService.logger.info("callBet, locking caller's balance :", {
    betId: bet.id,
    callerUser: callerUser,
    amount: bet.amount
  });

  let lockResults = await ethbetService.lockBalance(callerUser, bet.amount);

  logService.logger.info("callBet, locked caller's balance :", {
    tx: lockResults.tx,
    betId: bet.id,
    callerUser: callerUser,
    amount: bet.amount
  });

  let rollInput = {
    makerSeed: bet.seed,
    callerSeed: callerSeed,
    betId: bet.id,
  };
  let rollResults = await diceService.calculateRoll(rollInput);

  let rollUnder = 50 + bet.edge / 2;
  let makerWon = (rollResults.roll <= rollUnder);

  logService.logger.info("callBet: roll calculated", {
    rollInput: rollInput,
    rollResults: rollResults,
    rollUnder,
    makerWon
  });

  let initialDbUpdateAttrs = {
    executedAt: rollResults.executedAt,
    callerUser: callerUser,
    callerSeed: callerSeed,
    serverSeedHash: rollResults.serverSeedHash,
    roll: rollResults.roll,
    makerWon: makerWon
  };
  await bet.update(initialDbUpdateAttrs);
  logService.logger.info("callBet: pre-tx db update", Object.assign({}, bet.toJSON(), initialDbUpdateAttrs));

  let txResults;
  try {
    txResults = await ethbetService.executeBet(bet.user, callerUser, makerWon, bet.amount);
  }
  catch (err) {
    lockService.unlock(getBetLockId(bet.id));
    throw(err);
  }

  logService.logger.info("callBet: tx executed", {
    tx: txResults.tx,
    betId: bet.id,
  });

  let postTxDbUpdateAttrs = {
    txHash: txResults.tx,
    txSuccess: true,
  };
  await bet.update(postTxDbUpdateAttrs);
  logService.logger.info("callBet: post-tx db update", Object.assign({}, bet.toJSON(), postTxDbUpdateAttrs));

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
  getBetInfo
};