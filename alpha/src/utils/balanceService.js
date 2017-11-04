import EthbetContract from '../../build/contracts/Ethbet.json'
import EthbetTokenContract from '../../build/contracts/EthbetToken.json'

const contract = require('truffle-contract');

async function loadBalance(web3) {
  const ethbetContract = contract(EthbetContract);
  ethbetContract.setProvider(web3.currentProvider);
  const ethbetInstance = await ethbetContract.deployed();

  const balance = await ethbetInstance.balanceOf(web3.eth.defaultAccount);

  return balance.toNumber();
}

async function deposit(web3, amount) {
  const ethbetContract = contract(EthbetContract);
  ethbetContract.setProvider(web3.currentProvider);
  const ethbetInstance = await ethbetContract.deployed();

  const tokenContract = contract(EthbetTokenContract);
  tokenContract.setProvider(web3.currentProvider);
  const tokenInstance = await tokenContract.deployed();

  await tokenInstance.approve(ethbetInstance.address, amount);
  let results = await ethbetInstance.deposit(amount);
  return results;
}

let registryService = {
  loadBalance: loadBalance,
  deposit: deposit,
};

export default registryService;