const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const EthbetToken = artifacts.require("./EthbetToken.sol");

const Web3 = require('web3');

module.exports = function (deployer) {
  const web3 = new Web3(deployer.provider);

  //Parameters for the contract deployment
  const relayAddress = process.env.RELAY_ADDRESS || web3.eth.accounts[0];

  return deployer.deploy(EthbetOraclize, relayAddress, EthbetToken.address);
};