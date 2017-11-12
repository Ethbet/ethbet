var Ethbet = artifacts.require("./Ethbet.sol");
var EthbetToken = artifacts.require("./EthbetToken.sol");

const Web3 = require('web3');

module.exports = function(deployer) {
  const web3 = new Web3(deployer.provider);

  //Parameters for the contract deployment
  const adminAddr = web3.eth.accounts[0];
  const relayAddr = web3.eth.accounts[0];
  const makerFee = 1000000;
  const callerFee = 1000000;

  deployer.deploy(EthbetToken).then(() => {
     return deployer.deploy(Ethbet, adminAddr, relayAddr, EthbetToken.address, makerFee, callerFee);
  });

};
