const EthbetToken = artifacts.require("./EthbetToken.sol");
const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const proxiedWeb3Handler = require('../test/support/proxiedWeb3Handler.js');

async function run() {
  const web3 = EthbetToken.web3;
  const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);
  const accounts = await proxiedWeb3.eth.getAccounts();


  const tokenInstance = await EthbetToken.deployed();
  const ethbetOraclizeInstance = await EthbetOraclize.deployed();

  let maker = "0x48ebf29f03d7f031001166e2f2492461af2360d7";
  let caller = "0x6899bdb2968e4ee131e1ac78e704f9b289b4bf58";

  console.log("Transfering tokens");
  await tokenInstance.transfer(maker, 2000, { from: accounts[0], gas: 200000 });
  await tokenInstance.transfer(caller, 2000, { from: accounts[0] , gas: 200000});

}

module.exports = function (callback) {
  try {
    run().then(() => {
      callback();
    })
  }
  catch (err) {
    callback(err);
  }
};
