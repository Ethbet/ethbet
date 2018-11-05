const contractService = require('../contractService');
const web3Service = require('../web3Service');
const ethUtil = require('ethereumjs-util');

const CREATE_GAS = 67000;
const CALL_GAS = 67000 + 66000;
const CANCEL_GAS = 52000;

let GAS = {
  create: CREATE_GAS,
  call: CALL_GAS,
  cancel: CANCEL_GAS
};

async function balanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  const balance = await ethbetInstance.balanceOf(userAddress);

  return balance.toNumber();
}

async function ethBalanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  const balance = await ethbetInstance.ethBalanceOf(userAddress);

  return balance.toNumber();
}

async function lockedBalanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  const lockedBalance = await ethbetInstance.lockedBalanceOf(userAddress);

  return lockedBalance.toNumber();
}

async function lockBalance(userAddress, amount, operationType, gasPriceType) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let gasPrice = await web3Service.getGasPrice(gasPriceType);

  let results = await ethbetInstance.lockBalance(userAddress, amount, parseInt(gasPrice * GAS[operationType], 10), {
    gas: 100000,
    gasPrice: gasPrice
  });
  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }
  return results;
}

async function unlockBalance(userAddress, amount, gasPriceType) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let gasPrice = await web3Service.getGasPrice(gasPriceType);

  let results = await ethbetInstance.unlockBalance(userAddress, amount, parseInt(gasPrice * CANCEL_GAS, 10), {
    gas: 100000,
    gasPrice: gasPrice
  });
  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }
  return results;
}

async function executeBet(maker, caller, makerWon, amount, gasPriceType) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let gasPrice = await web3Service.getGasPrice(gasPriceType);

  let results = await ethbetInstance.executeBet(maker, caller, makerWon, amount, {
    gas: 150000,
    gasPrice: gasPrice
  });
  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }
  return results;
}

async function createFee(gasPriceType) {
  let gasPrice = await web3Service.getGasPrice(gasPriceType);

  return gasPrice * CREATE_GAS;
}

async function callFee(gasPriceType) {
  let gasPrice = await web3Service.getGasPrice(gasPriceType);

  return gasPrice * CALL_GAS;
}

async function cancelFee(gasPriceType) {
  let gasPrice = await web3Service.getGasPrice(gasPriceType);

  return gasPrice * CANCEL_GAS;
}

module.exports = {
  balanceOf: balanceOf,
  ethBalanceOf: ethBalanceOf,
  lockedBalanceOf: lockedBalanceOf,
  lockBalance: lockBalance,
  unlockBalance: unlockBalance,
  executeBet: executeBet,
  createFee: createFee,
  callFee: callFee,
  cancelFee: cancelFee,
  CREATE_GAS,
  CALL_GAS,
  CANCEL_GAS,
};
