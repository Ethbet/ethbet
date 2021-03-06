const Web3 = require('web3');
const _ = require('lodash');
const axios = require('axios');

let web3;
let axiosClient = axios.create({});

function init() {
  let provider = new Web3.providers.HttpProvider(`http://${ process.env.ETH_NODE_HOST || 'localhost'}:8545`);
  web3 = new Web3(provider);

  web3.eth.getAccounts((err, accounts) => {
    if (err) {
      console.log(err);
      process.exit(0);
    }

    let relayAccount;
    let relayAccountIndex = _.indexOf(accounts, _.toLower(process.env.RELAY_ADDRESS));
    if (relayAccountIndex < 0) {
      if (process.env.NODE_ENV === 'production') {
        console.log(`[Web3] Account matching RELAY_ADDRESS (${process.env.RELAY_ADDRESS}) not found`);
        process.exit(0);
      }
      else {
        relayAccount = accounts[0];
      }
    }
    else {
      relayAccount = accounts[relayAccountIndex];
    }


    web3.eth.defaultAccount = relayAccount;
    console.log('[Web3] Account:', web3.eth.defaultAccount);

    let networkName;
    web3.version.getNetwork((err, networkId) => {
      if (err) {
        console.log(err);
        process.exit(0);
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

async function getGasPrice(type = "high") {
  let MAX_GAS_PRICE = 40 * 10 ** 9;
  let DEFAULT_GAS_PRICE = 20 * 10 ** 9;

  let multiplier = 1;
  switch (type) {
    case "high":
      multiplier = 1;
      break;
    case "medium":
      multiplier = 0.8;
      break;
    case "low":
      multiplier = 0.6;
      break;
  }


  try {
    let response = await axiosClient.get('https://api.blockcypher.com/v1/eth/main');

    let gasPrice = Math.min(response.data.high_gas_price * multiplier, MAX_GAS_PRICE);
    return parseInt(gasPrice, 10);
  }
  catch (err) {
    console.log("getGasPrice", err);
    return DEFAULT_GAS_PRICE * multiplier;
  }
}

module.exports = {
  init: init,
  getWeb3: getWeb3,
  getGasPrice
};