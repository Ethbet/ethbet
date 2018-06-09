const EthbetToken = artifacts.require("./EthbetToken.sol");
const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const proxiedWeb3Handler = require('../test/support/proxiedWeb3Handler.js');

async function run() {
  const web3 = EthbetToken.web3;
  const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

  const accounts = await proxiedWeb3.eth.getAccounts();

  const tokenInstance = await EthbetToken.deployed();
  const ethbetOraclizeInstance = await EthbetOraclize.deployed();

  console.log("Transfering tokens");
  await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] });
  await tokenInstance.transfer(accounts[2], 1000, { from: accounts[0] });

  console.log("depositing tokens");
  await tokenInstance.approve(ethbetOraclizeInstance.address, 400, { from: accounts[1] });
  await ethbetOraclizeInstance.deposit(400, { from: accounts[1] });

  await tokenInstance.approve(ethbetOraclizeInstance.address, 600, { from: accounts[2] });
  await ethbetOraclizeInstance.deposit(600, { from: accounts[2] });

  console.log("depositing eth");
  await ethbetOraclizeInstance.depositEth({ from: accounts[1], value: web3.toWei(0.5, 'ether') });

  await ethbetOraclizeInstance.depositEth({ from: accounts[2], value: web3.toWei(0.4, 'ether') });

  console.log("charging fee and locking eth");
  await ethbetOraclizeInstance.chargeFeeAndLockEthBalance(accounts[1], web3.toWei(0.2, "ether"), { from: accounts[0] });

  let betId = 45;
  let maker = accounts[1];
  let caller = accounts[2];
  let amount =  web3.toWei(0.2, "ether") ;
  let rollUnder = 5300; // 6% edge

  console.log("Initializing bet");
  let results = await ethbetOraclizeInstance.initBet(betId, maker, caller, amount, rollUnder, {
    from: accounts[0],
  });


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
