const contractService = require('../contractService');
const web3Service = require('../web3Service');
const ethUtil = require('ethereumjs-util');

async function balanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  const balance = await ethbetOraclizeInstance.balanceOf(userAddress);

  return balance.toNumber();
}

async function ethBalanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  const ethBalance = await ethbetOraclizeInstance.ethBalanceOf(userAddress);

  return web3.fromWei(ethBalance.toNumber(), 'ether');
}

async function lockedEthBalanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  const lockedEthBalance = await ethbetOraclizeInstance.lockedEthBalanceOf(userAddress);

  return web3.fromWei(lockedEthBalance.toNumber(), 'ether');
}

async function isBetInitialized(betId) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  const initialized = await ethbetOraclizeInstance.isBetInitialized(betId);

  return initialized;
}

async function chargeFeeAndLockEthBalance(userAddress, amount) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  let results = await ethbetOraclizeInstance.chargeFeeAndLockEthBalance(userAddress, web3.toWei(amount, 'ether'), {
    gas: 100000,
  });
  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }
  return results;
}

async function unlockEthBalance(userAddress, amount) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  let results = await ethbetOraclizeInstance.unlockEthBalance(userAddress, web3.toWei(amount, 'ether'), {
    gas: 100000,
  });
  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }
  return results;
}

async function initBet(betId, maker, caller, amount, rollUnder) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  let oraclizeParamsPromises = [ethbetOraclizeInstance.oraclizeGasPrice(), ethbetOraclizeInstance.oraclizeGasLimit()];
  let oraclizeParams = await Promise.all(oraclizeParamsPromises);

  let [oraclizeGasPrice, oraclizeGasLimit] = oraclizeParams;

  let results = await ethbetOraclizeInstance.initBet(betId, maker, caller, web3.toWei(amount, 'ether'), rollUnder * 100,
    {
      gas: 400000,
      value: (oraclizeGasPrice.toNumber() * oraclizeGasLimit.toNumber()) + parseInt(web3.toWei(0.00006, "ether"), 10) // Oraclize Gas price * limit  + query price 0.05 USD
    }
  );

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }
  return results;
}

async function getBetById(betId) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  const etherBetData = await ethbetOraclizeInstance.getBetById(betId);

  return {
    maker: etherBetData[0],
    caller: etherBetData[1],
    amount: parseFloat(web3.fromWei(etherBetData[2].toNumber(), "ether")),
    rollUnder: etherBetData[3].toNumber() / 100,
    rawResult: etherBetData[4],
    roll: etherBetData[5].toNumber() / 100,
    makerWon: etherBetData[6],
    executedAt: etherBetData[7].toNumber() > 0 ? new Date(etherBetData[7].toNumber()) : null,
  };
}

async function watchBetExecutionEvent(betId) {
  const web3 = web3Service.getWeb3();
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  return new Promise(function (resolve, reject) {
    const event = ethbetOraclizeInstance.ExecutedBet({ betId: betId });
    event.watch(function (error, result) {
      if (error) {
        return reject(error);
      }

      event.stopWatching();
      resolve();
    });
  });
}

module.exports = {
  balanceOf,
  ethBalanceOf,
  lockedEthBalanceOf,
  isBetInitialized,
  chargeFeeAndLockEthBalance,
  unlockEthBalance,
  initBet,
  getBetById,
  watchBetExecutionEvent
};