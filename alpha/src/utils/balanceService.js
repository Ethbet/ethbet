import EthbetContract from '../../build/contracts/Ethbet.json'
import EthbetTokenContract from '../../build/contracts/EthbetToken.json'

const contract = require('truffle-contract');

async function loadBalance(web3) {
  const ethbetContract = contract(EthbetContract);
  ethbetContract.setProvider(web3.currentProvider);
  const ethbetInstance = await ethbetContract.deployed();

  const ethbetTokenContract = contract(EthbetTokenContract);
  ethbetTokenContract.setProvider(web3.currentProvider);
  const tokenInstance = await ethbetTokenContract.deployed();

  const balance = await tokenInstance.allowance.call(web3.eth.defaultAccount, ethbetInstance.address);

  return balance.toNumber();
}


let registryService = {
  loadBalance: loadBalance,
};

export default registryService;