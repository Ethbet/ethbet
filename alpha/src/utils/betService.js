import EthbetContract from '../../build/contracts/Ethbet.json'
import EthbetTokenContract from '../../build/contracts/EthbetToken.json'

const contract = require('truffle-contract');

async function makeBet(web3, bet) {
  return {};
}

let betService = {
  makeBet: makeBet,
};

export default betService;