import {client, apiRoot} from './apiService';
import web3Service from './web3Service';


async function makeBet(web3, newBet) {
  let newBetData = {
    amount: parseFloat(newBet.amount),
    edge: parseFloat(newBet.edge),
  };

  let message = await web3Service.sign(web3, newBetData);

  return await client.post(apiRoot + '/ether-bets', message);
}

async function cancelBet(web3, betId) {
  let cancelBetData = {
    id: betId
  };

  let message = await web3Service.sign(web3, cancelBetData);

  return await client.post(`${apiRoot}/ether-bets/cancel`, message);
}

async function callBet(web3, betId) {
  let callBetData = {
    id: betId,
  };

  let message = await web3Service.sign(web3, callBetData);

  return await client.post(`${apiRoot}/ether-bets/call`, message);
}

async function getActiveBets(opts) {
  let response = await client.get(apiRoot + '/ether-bets/active', {params: opts});

  return response.data.results;
}

async function getUserActiveBetsCount(web3) {
  let response = await client.get(apiRoot + '/ether-bets/user-active-bets-count', { params: {userAddress: web3.eth.defaultAccount} });

  return response.data.count;
}

async function getExecutedBets() {
  let response = await client.get(apiRoot + '/ether-bets/executed');

  return response.data.bets;
}

async function getBetInfo(betId) {
  let response = await client.get(apiRoot + '/ether-bets/' + betId);

  return response.data;
}

async function getPendingBets() {
  let response = await client.get(apiRoot + '/ether-bets/pending');

  return response.data.bets;
}

let etherBetService = {
  makeBet,
  cancelBet,
  callBet,
  getActiveBets,
  getUserActiveBetsCount,
  getExecutedBets,
  getBetInfo,
  getPendingBets,
};

export default etherBetService;