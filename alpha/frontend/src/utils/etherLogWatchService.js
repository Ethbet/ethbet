import contractService from '../utils/contractService';
import configureStore from '../store/configureStore';
import * as etherBalanceActions from "../actions/etherBalanceActions";


async function start(web3) {
  let store = configureStore();

  console.log("Starting ETHER logWatch ...");
  const ethbetOraclizeInstance = await contractService.getDeployedInstance(web3, "EthbetOraclize");
  const ethbetTokenInstance = await contractService.getDeployedInstance(web3, "EthbetToken");

  const unlockedEthBalanceEvent = ethbetOraclizeInstance.UnlockedEthBalance({user: web3.eth.defaultAccount});
  unlockedEthBalanceEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const lockedEthBalanceEvent = ethbetOraclizeInstance.LockedEthBalance({user: web3.eth.defaultAccount});
  lockedEthBalanceEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const executedBetWonEvent = ethbetOraclizeInstance.ExecutedBet({winner: web3.eth.defaultAccount});
  executedBetWonEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const executedBetLostEvent = ethbetOraclizeInstance.ExecutedBet({loser: web3.eth.defaultAccount});
  executedBetLostEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const transferDestinationEvent = ethbetTokenInstance.Transfer({to: web3.eth.defaultAccount});
  transferDestinationEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const transferOriginEvent = ethbetTokenInstance.Transfer({from: web3.eth.defaultAccount});
  transferOriginEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const ethDepositEvent = ethbetOraclizeInstance.EthDeposit({user: web3.eth.defaultAccount});
  ethDepositEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

  const ethWithdrawEvent = ethbetOraclizeInstance.EthWithdraw({user: web3.eth.defaultAccount});
  ethWithdrawEvent.watch(function (error, result) {
    if (error) {
      return console.log("[etherLogWatchService] error:", error);
    }

    store.dispatch(etherBalanceActions.loadBalances());
  });

}


let etherLogWatchService = {
  start: start
};

export default etherLogWatchService;