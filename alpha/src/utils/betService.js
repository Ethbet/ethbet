import {client, apiRoot} from './apiService';

import web3Service from './web3Service';
import randomService from './randomService';


async function makeBet(web3, newBet) {
  let newBetData = {
    amount: parseFloat(newBet.amount) * 100,   // 2 decimals for EBET
    edge: parseFloat(newBet.edge),
    seed: randomService.generateSeed()
  };

  let message = await web3Service.sign(web3, newBetData);

  return await client.post(apiRoot + '/bets', message);
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