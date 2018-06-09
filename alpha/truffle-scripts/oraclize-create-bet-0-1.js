const EthbetToken = artifacts.require("./EthbetToken.sol");
const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const proxiedWeb3Handler = require('../test/support/proxiedWeb3Handler.js');

async function run() {
  const web3 = EthbetToken.web3;
  const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);
  const accounts = await proxiedWeb3.eth.getAccounts();

  const tokenInstance = await EthbetToken.deployed();
  const ethbetOraclizeInstance = await EthbetOraclize.deployed();


  let betId = 45;
  let maker = "0x48ebf29f03d7f031001166e2f2492461af2360d7";
  let caller = "0x6899bdb2968e4ee131e1ac78e704f9b289b4bf58";
  let amount =  web3.toWei(0.02, "ether") ;
  let rollUnder = 5300; // 6% edge

  console.log("charging fee and locking eth");
  await ethbetOraclizeInstance.chargeFeeAndLockEthBalance(maker, web3.toWei(0.02, "ether"), { from: accounts[0], gas: 200000 });

  console.log("Initializing bet");
  let results = await ethbetOraclizeInstance.initBet(betId, maker, caller, amount, rollUnder, { from: accounts[0], gas: 600000,value: web3.toWei(0.01, "ether") });

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
