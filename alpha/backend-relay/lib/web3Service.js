const Web3 = require('web3');

let web3;

function init() {
  let provider = new Web3.providers.HttpProvider('http://localhost:8545');
  web3 = new Web3(provider);

  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      return reject(err);
    }

    web3.eth.defaultAccount = accounts[0];
    console.log('[Web3] Account:', web3.eth.defaultAccount);

    let networkName;
    web3.version.getNetwork((err, networkId) => {
      if (err) {
        return reject(err);
      }

      switch (networkId) {
        case "1":
          networkName = "Main";
          break;
        case "2":
          networkName = "Morden";
          break;
        case "3":
          networkName = "Ropsten";
          break;
        case "4":
          networkName = "Rinkeby";
          break;
        case "42":
          networkName = "Kovan";
          break;
        default:
          networkName = "Unknown";
      }

      if (networkName === "Unknown" && parseInt(networkId, 10) > 0) {
        networkName = "Private"
      }

      console.log('[Web3] Network:', networkName);
    });
  });
}

function getWeb3() {
  return web3;
}

module.exports = {
  init: init,
  getWeb3: getWeb3
};