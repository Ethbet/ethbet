import Web3 from 'web3'

const ethUtil = require('ethereumjs-util');

let getWeb3 = () => new Promise(function (resolve, reject) {
  // Wait for loading completion to avoid race conditions with web3 injection timing.
  window.addEventListener('load', function () {
    let web3 = window.web3;

    // Checking if Web3 has been injected by the browser (Mist/MetaMask)
    if (typeof web3 !== 'undefined') {
      // Use Mist/MetaMask's provider.
      web3 = new Web3(web3.currentProvider);
      console.log('Injected web3 detected.');
    } else if (process.env.NODE_ENV === "development") {
      // Fallback to localhost if no web3 injection.
      let provider = new Web3.providers.HttpProvider('http://localhost:8545');
      web3 = new Web3(provider);
      console.log('No web3 instance injected, using Local web3.');
    }
    else {
      return reject(new Error('No web3 instance injected.'));
    }

    web3.eth.getAccounts((err, accounts) => {
      if (err) {
        return reject(err);
      }

      web3.eth.defaultAccount = accounts[0];
      console.log('Using account:', web3.eth.defaultAccount);
      
      // poll for metamask account change => refresh page
      let currentAccount = accounts[0];
      setInterval(function () {
        web3.eth.getAccounts((err, accounts) => {
          if (accounts[0] !== currentAccount) {
            window.location.reload();
          }
        });
      }, 1000);

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

        resolve({web3, networkName});
      });
    });
  });
});

function sign(web3, object) {
  return new Promise((resolve, reject) => {
    let data = ethUtil.bufferToHex(JSON.stringify(object));

    web3.currentProvider.sendAsync({
      method: 'personal_sign',
      params: [web3.eth.defaultAccount, data],
    }, function (err, signatureData) {
      //  web3.eth.sign(web3.eth.defaultAccount, data, function (err, signature) {
      if (err || signatureData.error) {
        return reject(err || signatureData.error);
      }

      resolve({data: data, sig: signatureData.result, address: web3.eth.defaultAccount});
    });
  });
}

function getCurrentBlockNumber(web3) {
  return new Promise((resolve, reject) => {
    web3.eth.getBlockNumber(function (error, result) {
      if (error) {
        return reject(error);
      }

      resolve(result);
    });
  });
}

let web3Service = {
  getWeb3,
  sign,
  getCurrentBlockNumber
};


export default web3Service;
