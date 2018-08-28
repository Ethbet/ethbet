const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const EthbetToken = artifacts.require("./EthbetToken.sol");

const Web3 = require('web3');

module.exports = function (deployer, network) {
  const web3 = new Web3(deployer.provider);

  //Parameters for the contract deployment
  const relayAddress = process.env.RELAY_ADDRESS || web3.eth.accounts[0];

  // avoid accidental deploy
  if (process.env.RELAY_ADDRESS) {
    return true;
  }
  else {
    // deploy with 250000 max gas, 10 Gwei price
    return deployer.deploy(EthbetOraclize, relayAddress, EthbetToken.address, 300000, 10 * Math.pow(10, 9), network === "development");
  }
};