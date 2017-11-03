var Ethbet = artifacts.require("./Ethbet.sol");
var EthbetToken = artifacts.require("./EthbetToken.sol");

module.exports = function(deployer) {

  //Parameters for the contract deployment
  const adminAddr = "0xf43142d41d92da6B9EbE2CbBd7E661eeee97edB0";
  const relayAddr = "0xf43142d41d92da6B9EbE2CbBd7E661eeee97edB0";
  const makerFee = 1000000;
  const callerFee = 1000000;

  deployer.deploy(EthbetToken).then(() => {
     return deployer.deploy(Ethbet, adminAddr, relayAddr, EthbetToken.address, makerFee, callerFee);
  });

};
