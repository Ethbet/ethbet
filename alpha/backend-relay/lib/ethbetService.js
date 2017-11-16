const contractService = require('./contractService');
const web3Service = require('./web3Service');

async function balanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  const balance = await ethbetInstance.balanceOf(userAddress);

  return balance.toNumber();
}

async function lockedBalanceOf(userAddress) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  const lockedBalance = await ethbetInstance.lockedBalanceOf(userAddress);

  return lockedBalance.toNumber();
}

async function lockBalance(userAddress, amount) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let results = await ethbetInstance.lockBalance(userAddress, amount);
  return results;
}

async function unlockBalance(userAddress, amount) {
  const web3 = web3Service.getWeb3();
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let results = await ethbetInstance.unlockBalance(userAddress, amount);
  return results;
}

module.exports = {
  balanceOf: balanceOf,
  lockedBalanceOf: lockedBalanceOf,
  lockBalance: lockBalance,
  unlockBalance: unlockBalance,
};
