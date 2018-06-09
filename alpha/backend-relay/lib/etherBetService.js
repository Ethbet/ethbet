let _ = require('lodash');

let socketService = require('./socketService');
let ethbetOraclizeService = require('./blockchain/ethbetOraclizeService');
let userService = require('./userService');
let lockService = require('./lockService');
let logService = require('./etherLogService');

let EBET_FEE = 200;

async function createBet(etherBetData) {
  let userEtherBalance = await ethbetOraclizeService.ethBalanceOf(etherBetData.user);

  if (userEtherBalance < etherBetData.amount) {
    throw new Error("Insufficient ETH Balance for bet");
  }

  let userEbetBalance = await ethbetOraclizeService.balanceOf(etherBetData.user);

  if (userEbetBalance < EBET_FEE) {
    throw new Error("Insufficient EBET Balance for bet");
  }

  let etherBet = await db.EtherBet.create(etherBetData);

  logService.logger.info("New Ether Bet, db updated: ", etherBet.toJSON());

  let results = await ethbetOraclizeService.chargeFeeAndLockEthBalance(etherBet.user, etherBet.amount);

  logService.logger.info("New Ether Bet, fee charged & balance locked : ", {
    tx: results.tx,
    etherBetId: etherBet.id,
    user: etherBet.user,
    amount: etherBet.amount
  });

  etherBet.dataValues.username = await userService.getUsername(etherBet.user);
  socketService.emit("etherBetCreated", etherBet);

  return etherBet;
}

async function getActiveBets(opts = { orderField: 'createdAt', orderDirection: 'DESC', offset: 0 }) {
  let result = await db.EtherBet.findAndCountAll({
    where: {
      cancelledAt: null,
      initializedAt: null,
    },
    order: [
      [opts.orderField, opts.orderDirection]
    ],
    offset: opts.offset,
    limit: 50
  });

  let populatedEtherBets = await userService.populateUserNames(result.rows);

  return { etherBets: populatedEtherBets, count: result.count };
}

async function getExecutedBets() {
  let bets = await db.EtherBet.findAll({
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

  let populatedEtherBets = await userService.populateUserNames(bets);

  return populatedEtherBets;
}


function getEtherBetLockId(etherBetId) {
  return `ether-bet-${etherBetId}`;
}

async function cancelBet(etherBetId, user) {
  let etherBet = await db.EtherBet.findById(etherBetId);
  if (!etherBet) {
    throw new Error("Ether Bet not found");
  }
  if (etherBet.cancelledAt) {
    throw new Error("Ether Bet already cancelled");
  }
  if (etherBet.initializedAt) {
    throw new Error("Ether Bet already called, execution in progress");
  }
  if (etherBet.executedAt) {
    throw new Error("Ether Bet already executed");
  }
  if (etherBet.user !== user) {
    throw new Error("You can't cancel someone else's bet");
  }

  let userLockedEthBalance = await ethbetOraclizeService.lockedEthBalanceOf(user);
  if (userLockedEthBalance < etherBet.amount) {
    throw new Error("Locked Eth Balance is less than bet amount");
  }

  try {
    await lockService.lock(getEtherBetLockId(etherBetId));
  }
  catch (err) {
    if (err.code === 'EEXIST') {
      throw new Error("Somebody else is currently calling or cancelling this ether bet ...");
    }
  }

  let results = await ethbetOraclizeService.unlockEthBalance(etherBet.user, etherBet.amount);

  logService.logger.info("Ether Bet Canceled, balance unlocked : ", {
    tx: results.tx,
    etherBetId: etherBet.id,
    user: etherBet.user,
    amount: etherBet.amount
  });

  let cancelledAt = new Date();
  await etherBet.update({ cancelledAt });

  logService.logger.info("Ether Bet Canceled, db updated : ", { etherBetId: etherBet.id, cancelledAt });

  await lockService.unlock(getEtherBetLockId(etherBetId));

  socketService.emit("etherBetCanceled", etherBet);

  return etherBet;
}


module.exports = {
  createBet,
  getActiveBets,
  getExecutedBets,
  cancelBet,
};