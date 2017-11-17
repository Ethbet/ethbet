import {client, apiRoot} from './apiService';

import web3Service from './web3Service';
import randomService from './randomService';


async function makeBet(web3, newBet) {
  let newBetData = {
    amount: Math.round(parseFloat(newBet.amount) * 100),   // 2 decimals for EBET
    edge: parseFloat(newBet.edge),
    seed: randomService.generateSeed()
  };

  let message = await web3Service.sign(web3, newBetData);

  return await client.post(apiRoot + '/bets', message);
}

async function cancelBet(web3, betId) {
  let cancelBetData = {
    id: betId
  };

  let message = await web3Service.sign(web3, cancelBetData);

  return await client.post(`${apiRoot}/bets/cancel`, message);
}

async function callBet(web3, betId) {
  let callBetData = {
    id: betId,
    seed: randomService.generateSeed()
  };

  let message = await web3Service.sign(web3, callBetData);

  return await client.post(`${apiRoot}/bets/call`, message);
}


async function getActiveBets() {
  let response = await client.get(apiRoot + '/bets/active');

  return response.data.bets;
}

async function getExecutedBets() {
  let response = await client.get(apiRoot + '/bets/executed');

  return response.data.bets;
}

let betService = {
  makeBet,
  cancelBet,
  callBet,
  getActiveBets,
  getExecutedBets,
};

export default betService;