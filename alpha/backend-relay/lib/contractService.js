const truffleContract = require('truffle-contract');

let Ethbet = require('../../build/contracts/Ethbet.json');

const contracts = {
  Ethbet: Ethbet
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

module.exports = {
  getDeployedInstance: getDeployedInstance,
  getInstanceAt: getInstanceAt,
};
