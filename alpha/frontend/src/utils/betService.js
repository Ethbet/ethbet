import {client, apiRoot} from './apiService';

import web3Service from './web3Service';
import randomService from './randomService';

import contractService from '../utils/contractService';

async function makeBet(web3, gasPriceType, newBet) {
  let newBetData = {
    amount: Math.round(parseFloat(newBet.amount) * 100),   // 2 decimals for EBET
    edge: parseFloat(newBet.edge),
    gasPriceType,
    seed: randomService.generateSeed()
  };

  // check balance is sufficient
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");
  const userBalance = await ethbetInstance.balanceOf(web3.eth.defaultAccount);
  if (userBalance < newBetData.amount) {
    throw new Error("Insufficient EBET Balance for bet, please deposit some EBET");
  }

  let message = await web3Service.sign(web3, newBetData);

  return await client.post(apiRoot + '/bets', message);
}

async function cancelBet(web3, gasPriceType, betId) {
  let cancelBetData = {
    id: betId,
    gasPriceType
  };

  let message = await web3Service.sign(web3, cancelBetData);

  return await client.post(`${apiRoot}/bets/cancel`, message);
}

async function callBet(web3, gasPriceType, betId, betAmount) {
  let callBetData = {
    id: betId,
    seed: randomService.generateSeed(),
    gasPriceType
  };

  // check balance is sufficient
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");
  const userBalance = await ethbetInstance.balanceOf(web3.eth.defaultAccount);
  if (userBalance < betAmount) {
    throw new Error("Insufficient EBET Balance for bet, please deposit some EBET");
  }

  let message = await web3Service.sign(web3, callBetData);

  return await client.post(`${apiRoot}/bets/call`, message);
}


async function getActiveBets(opts) {
  let response = await client.get(apiRoot + '/bets/active', { params: opts });

  return response.data.results;
}

async function getUserActiveBetsCount(web3) {
  let response = await client.get(apiRoot + '/bets/user-active-bets-count', { params: {userAddress: web3.eth.defaultAccount} });

  return response.data.count;
}

async function getExecutedBets() {
  let response = await client.get(apiRoot + '/bets/executed');

  return response.data.bets;
}

async function getBetInfo(betId) {
  let response = await client.get(apiRoot + '/bets/' + betId);

  return response.data;
}

let betService = {
  makeBet,
  cancelBet,
  callBet,
  getActiveBets,
  getUserActiveBetsCount,
  getExecutedBets,
  getBetInfo,
};

export default betService;