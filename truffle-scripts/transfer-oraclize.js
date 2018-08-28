// Truffle script to transfer tokens/Eth from deployer to an account for testing purposes

const EthbetToken = artifacts.require("./EthbetToken.sol");
const proxiedWeb3Handler = require('../test/support/proxiedWeb3Handler.js');

async function run() {
  let userAddress = process.argv[4];
  if (!userAddress) {
    throw Error("User Address needed as argument");
  }

  const web3 = EthbetToken.web3;
  const proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);
  const accounts = await proxiedWeb3.eth.getAccounts();

  const tokenInstance = await EthbetToken.deployed();

  await tokenInstance.transfer(userAddress, 50000, {from: accounts[0]});
  console.log("Transfered 500 EBET to " + userAddress);
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
