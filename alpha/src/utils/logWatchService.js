import contractService from '../utils/contractService';
import configureStore from '../store/configureStore';

import * as balanceActions from '../actions/balanceActions';

async function start(web3) {
  let store = configureStore();

  console.log("Starting EBET logWatch ...");
  const ethbetInstance = await contractService.getDeployedInstance(web3, "Ethbet");
  const ethbetTokenInstance = await contractService.getDeployedInstance(web3, "EthbetToken");

  const unlockedBalanceEvent = ethbetInstance.UnlockedBalance({user: web3.eth.defaultAccount});
  unlockedBalanceEvent.watch(function (error, result) {
    if (error) {
      return console.log("[logWatchService] error:", error);
    }

    store.dispatch(balanceActions.loadBalances());
  });

  const lockedBalanceEvent = ethbetInstance.LockedBalance({user: web3.eth.defaultAccount});
  lockedBalanceEvent.watch(function (error, result) {
    if (error) {
      return console.log("[logWatchService] error:", error);
    }

    store.dispatch(balanceActions.loadBalances());
  });

  const executedBetWonEvent = ethbetInstance.ExecutedBet({winner: web3.eth.defaultAccount});
  executedBetWonEvent.watch(function (error, result) {
    if (error) {
      return console.log("[logWatchService] error:", error);
    }

    store.dispatch(balanceActions.loadBalances());
  });

  const executedBetLostEvent = ethbetInstance.ExecutedBet({loser: web3.eth.defaultAccount});
  executedBetLostEvent.watch(function (error, result) {
    if (error) {
      return console.log("[logWatchService] error:", error);
    }

    store.dispatch(balanceActions.loadBalances());
  });

  const transferDestinationEvent = ethbetTokenInstance.Transfer({to: web3.eth.defaultAccount});
  transferDestinationEvent.watch(function (error, result) {
    if (error) {
      return console.log("[logWatchService] error:", error);
    }

    store.dispatch(balanceActions.loadBalances());
  });

  const transferOriginEvent = ethbetTokenInstance.Transfer({from: web3.eth.defaultAccount});
  transferOriginEvent.watch(function (error, result) {
    if (error) {
      return console.log("[logWatchService] error:", error);
    }

    store.dispatch(balanceActions.loadBalances());
  });
}


let logWatchService = {
  start: start
};

export default logWatchService;