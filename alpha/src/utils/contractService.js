const truffleContract = require('truffle-contract');

const EthbetToken = require('../../build/contracts/EthbetToken.json');
const Ethbet = require('../../build/contracts/Ethbet.json');

const contracts = {
  EthbetToken,
  Ethbet,
};

const deployedInstances = {};

async function getDeployedInstance(web3, contractName) {
  if (deployedInstances[contractName]) {
    return deployedInstances[contractName];
  }

  const contract = truffleContract(contracts[contractName]);
  contract.setProvider(web3.currentProvider);
  const instance = await contract.deployed();

  deployedInstances[contractName] = instance;

  return instance;
}

async function getInstanceAt(web3, contractName, address) {
  const contract = truffleContract(contracts[contractName]);
  contract.setProvider(web3.currentProvider);
  const instance = await contract.at(address);

  return instance;
}

let contractService = {
  getDeployedInstance: getDeployedInstance,
  getInstanceAt: getInstanceAt,
};

export default contractService;