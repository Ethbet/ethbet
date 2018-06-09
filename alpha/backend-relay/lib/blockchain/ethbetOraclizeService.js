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

module.exports = {
  balanceOf,
  ethBalanceOf,
  lockedEthBalanceOf,
  isBetInitialized,
  chargeFeeAndLockEthBalance,
  unlockEthBalance,
};
