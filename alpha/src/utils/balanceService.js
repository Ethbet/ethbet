import contractService from '../utils/contractService';


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

  await tokenInstance.increaseApproval(ethbetInstance.address, amount);

  let results = await ethbetInstance.deposit(amount);
  return results;
}

async function withdraw(web3, amount) {
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  let results = await ethbetInstance.withdraw(amount);
  return results;
}

let registryService = {
  loadBalances: loadBalances,
  deposit: deposit,
  withdraw: withdraw,
};

export default registryService;