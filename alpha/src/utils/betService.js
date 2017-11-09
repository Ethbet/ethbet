import {client, apiRoot} from './apiService';

async function makeBet(web3, newBet) {
  let newBetData = {
    amount:  parseFloat(newBet.amount) * 100,   // 2 decimals for EBET
    edge: parseFloat(newBet.edge),
    user: web3.eth.defaultAccount
  };

  return await client.post(apiRoot + '/bets', newBetData);
}

async function getActiveBets() {
  let response = await client.get(apiRoot + '/bets/active');

  return response.data.bets;
}

let betService = {
  makeBet: makeBet,
  getActiveBets: getActiveBets
};

export default betService;