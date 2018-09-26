import contractService from '../utils/contractService';

const ethUtil = require('ethereumjs-util');


async function loadBalances(web3) {
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");
  const ethbetTokenInstance = await contractService.getDeployedInstance(web3, "EthbetToken");

  const balance = await ethbetInstance.balanceOf(web3.eth.defaultAccount);
  const lockedBalance = await ethbetInstance.lockedBalanceOf(web3.eth.defaultAccount);
  const walletBalance = await ethbetTokenInstance.balanceOf(web3.eth.defaultAccount);

  return {
    balance: balance.toNumber(),
    lockedBalance: lockedBalance.toNumber(),
    walletBalance: walletBalance.toNumber()
  };
}

async function deposit(web3, amount) {
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");
  const tokenInstance = await contractService.getDeployedInstance(web3, "EthbetToken");

  // no need to await as this would run previous to the deposit
  tokenInstance.increaseApproval(ethbetInstance.address, amount, { from: web3.eth.defaultAccount, gas: 100000 });

  // avoid metamask issue wrong order of transactions
  const wait = ms => new Promise(res => setTimeout(res, ms));
  await wait(2000);

  let results = await ethbetInstance.deposit(amount, { from: web3.eth.defaultAccount, gas: 100000 });

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }

  return results;
}

async function withdraw(web3, amount) {
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let results = await ethbetInstance.withdraw(amount, { from: web3.eth.defaultAccount, gas: 100000 });

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }

  return results;
}

let balanceService = {
  loadBalances: loadBalances,
  deposit: deposit,
  withdraw: withdraw,
};

export default balanceService;