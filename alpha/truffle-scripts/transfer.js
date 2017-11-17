// Truffle script to transfer tokens/Eth from deployer to an account for testing purposes

const EthbetToken = artifacts.require("./EthbetToken.sol");

async function run() {
  let userAddress = process.argv[4];
  if (!userAddress) {
    throw Error("User Address needed as argument");
  }

  const web3 = EthbetToken.web3;
  const accounts = web3.eth.accounts;

  const tokenInstance = await EthbetToken.deployed();

  await tokenInstance.transfer(userAddress, 50000, {from: accounts[0]});
  console.log("Transfered 500 EBET to " + userAddress);
  web3.eth.sendTransaction({from: web3.eth.accounts[0], to: userAddress, value: web3.toWei(3, 'ether')});
  console.log("Transfered 3 ETH to " + userAddress);
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
