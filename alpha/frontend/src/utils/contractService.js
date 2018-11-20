const truffleContract = require('truffle-contract');

const EthbetToken = require('../contracts/EthbetToken.json');
const Ethbet = require('../contracts/Ethbet.json');
const EthbetOraclize = require('../contracts/EthbetOraclize.json');

const contracts = {
  EthbetToken,
  Ethbet,
  EthbetOraclize,
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