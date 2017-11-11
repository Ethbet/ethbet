import contractService from '../utils/contractService';


async function loadBalance(web3) {
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");

  const balance = await ethbetInstance.balanceOf(web3.eth.defaultAccount);

  return balance.toNumber();
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
  loadBalance: loadBalance,
  deposit: deposit,
  withdraw: withdraw,
};

export default registryService;