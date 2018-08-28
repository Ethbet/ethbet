import contractService from './contractService';

const ethUtil = require('ethereumjs-util');
const promisify = require("promisify-es6");


async function loadBalances(web3) {
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");
  const ethbetTokenInstance = await contractService.getDeployedInstance(web3, "EthbetToken");

  // EBET
  const balance = await ethbetOraclizeInstance.balanceOf(web3.eth.defaultAccount);
  const walletBalance = await ethbetTokenInstance.balanceOf(web3.eth.defaultAccount);

  //ETH
  const weiBalance = await ethbetOraclizeInstance.ethBalanceOf(web3.eth.defaultAccount);
  const ethBalance = web3.fromWei(weiBalance.toNumber(), "ether");

  const lockedWeiBalance = await ethbetOraclizeInstance.lockedEthBalanceOf(web3.eth.defaultAccount);
  const lockedEthBalance = web3.fromWei(lockedWeiBalance.toNumber(), "ether");

  let walletWeiBalance = await promisify(web3.eth.getBalance)(web3.eth.defaultAccount);
  let walletEthBalance = web3.fromWei(walletWeiBalance.toNumber(), "ether");

  return {
    balance: balance.toNumber(),
    walletBalance: walletBalance.toNumber(),

    ethBalance: ethBalance,
    lockedEthBalance: lockedEthBalance,
    walletEthBalance: walletEthBalance,
  };
}

async function deposit(web3, amount) {
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");
  const tokenInstance = await contractService.getDeployedInstance(web3, "EthbetToken");

  // no need to await as this would run previous to the deposit
  tokenInstance.increaseApproval(ethbetOraclizeInstance.address, amount, {
    from: web3.eth.defaultAccount,
    gas: 100000
  });
  let results = await ethbetOraclizeInstance.deposit(amount, { from: web3.eth.defaultAccount, gas: 100000 });

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }

  return results;
}

async function withdraw(web3, amount) {
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  let results = await ethbetOraclizeInstance.withdraw(amount, { from: web3.eth.defaultAccount, gas: 100000 });

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }

  return results;
}

async function depositEth(web3, amount) {
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  let results = await ethbetOraclizeInstance.depositEth({
    value: web3.toWei(amount, 'ether'),
    from: web3.eth.defaultAccount,
    gas: 100000
  });

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }

  return results;
}

async function withdrawEth(web3, amount) {
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");

  let results = await ethbetOraclizeInstance.withdrawEth(web3.toWei(amount, 'ether'), {
    from: web3.eth.defaultAccount,
    gas: 100000
  });

  if (ethUtil.addHexPrefix(results.receipt.status.toString()) !== "0x1") {
    throw  new Error("Contract execution failed")
  }

  return results;
}

let etherBalanceService = {
  loadBalances: loadBalances,
  deposit: deposit,
  withdraw: withdraw,
  depositEth: depositEth,
  withdrawEth: withdrawEth,
};

export default etherBalanceService;