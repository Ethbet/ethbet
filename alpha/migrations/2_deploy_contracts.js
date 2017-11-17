var Ethbet = artifacts.require("./Ethbet.sol");
var EthbetToken = artifacts.require("./EthbetToken.sol");

const Web3 = require('web3');

module.exports = function (deployer) {
  const web3 = new Web3(deployer.provider);

  //Parameters for the contract deployment
  const relayAddress = web3.eth.accounts[0];

  deployer.deploy(EthbetToken).then(() => {
    return deployer.deploy(Ethbet, relayAddress, EthbetToken.address);
  });

};
