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

async function getExecutedBets() {
  let response = await client.get(apiRoot + '/ether-bets/executed');

  return response.data.bets;
}

let etherBetService = {
  makeBet,
  cancelBet,
  callBet,
  getActiveBets,
  getExecutedBets,
};

export default etherBetService;