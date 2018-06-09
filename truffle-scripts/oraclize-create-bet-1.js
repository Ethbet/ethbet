const EthbetToken = artifacts.require("./EthbetToken.sol");
const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const proxiedWeb3Handler = require('../test/support/proxiedWeb3Handler.js');

async function run() {
  const web3 = EthbetToken.web3;
  const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);
  const accounts = await proxiedWeb3.eth.getAccounts();

  const tokenInstance = await EthbetToken.deployed();
  const ethbetOraclizeInstance = await EthbetOraclize.deployed();


  console.log("depositing tokens");
  await tokenInstance.approve(ethbetOraclizeInstance.address, 1000, { from: accounts[0], gas: 200000 });
  await ethbetOraclizeInstance.deposit(1000, { from: accounts[0], gas: 200000 });

  console.log("depositing eth");
  await ethbetOraclizeInstance.depositEth({ value: web3.toWei(0.02, 'ether'), from: accounts[0], gas: 200000 });

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
