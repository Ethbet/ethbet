import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newDepositValue: 0,
  newWithdrawalValue: 0,
  
  newEthDepositValue: 0,
  newEthWithdrawalValue: 0,
};

export default function etherBalanceReducer(state = new ImmutableMap(initialData), action) {

  const fetchLoadBalanceRequest = (state) => {
    return state
      .set('loadingBalance', true);
  };

  const fetchLoadBalanceSuccess = (state) => {
    return state
      .set('loadingBalance', false)
      // EBET
      .set('balance', action.balance)
      .set('walletBalance', action.walletBalance)
      // ETH
      .set('ethBalance', action.ethBalance)
      .set('lockedEthBalance', action.lockedEthBalance)
      .set('walletEthBalance', action.walletEthBalance);
  };

  const fetchLoadBalanceFailure = (state) => {
    return state
      .set('loadingBalance', false);
  };

  const setNewDepositValue = (state) => {
    return state
      .set('newDepositValue', action.newDepositValue);
  };

  const postSaveNewDepositRequest = (state) => {
    return state
      .set('savingNewDeposit', true);
  };

  const postSaveNewDepositSuccess = (state) => {
    return state
      .set('savingNewDeposit', false)
      .set('newDepositValue', 0);
  };

  const postSaveNewDepositFailure = (state) => {
    return state
      .set('savingNewDeposit', false);
  };

  const setNewWithdrawalValue = (state) => {
    return state
      .set('newWithdrawalValue', action.newWithdrawalValue);
  };

  const postSaveNewWithdrawalRequest = (state) => {
    return state
      .set('savingNewWithdrawal', true);
  };

  const postSaveNewWithdrawalSuccess = (state) => {
    return state
      .set('savingNewWithdrawal', false)
      .set('newWithdrawalValue', 0);
  };

  const postSaveNewWithdrawalFailure = (state) => {
    return state
      .set('savingNewWithdrawal', false);
  };
  
  // ETH 

  const setNewEthDepositValue = (state) => {
    return state
      .set('newEthDepositValue', action.newEthDepositValue);
  };

  const postSaveNewEthDepositRequest = (state) => {
    return state
      .set('savingNewEthDeposit', true);
  };

  const postSaveNewEthDepositSuccess = (state) => {
    return state
      .set('savingNewEthDeposit', false)
      .set('newEthDepositValue', 0);
  };

  const postSaveNewEthDepositFailure = (state) => {
    return state
      .set('savingNewEthDeposit', false);
  };

  const setNewEthWithdrawalValue = (state) => {
    return state
      .set('newEthWithdrawalValue', action.newEthWithdrawalValue);
  };

  const postSaveNewEthWithdrawalRequest = (state) => {
    return state
      .set('savingNewEthWithdrawal', true);
  };

  const postSaveNewEthWithdrawalSuccess = (state) => {
    return state
      .set('savingNewEthWithdrawal', false)
      .set('newEthWithdrawalValue', 0);
  };

  const postSaveNewEthWithdrawalFailure = (state) => {
    return state
      .set('savingNewEthWithdrawal', false);
  };
  
  const actions = {
    'ETHER:FETCH_LOAD_BALANCE_REQUEST': () => fetchLoadBalanceRequest(state),
    'ETHER:FETCH_LOAD_BALANCE_SUCCESS': () => fetchLoadBalanceSuccess(state),
    'ETHER:FETCH_LOAD_BALANCE_FAILURE': () => fetchLoadBalanceFailure(state),
    
    'ETHER:SET_NEW_DEPOSIT_VALUE': () => setNewDepositValue(state),
    'ETHER:POST_SAVE_NEW_DEPOSIT_REQUEST': () => postSaveNewDepositRequest(state),
    'ETHER:POST_SAVE_NEW_DEPOSIT_SUCCESS': () => postSaveNewDepositSuccess(state),
    'ETHER:POST_SAVE_NEW_DEPOSIT_FAILURE': () => postSaveNewDepositFailure(state),
    
    'ETHER:SET_NEW_WITHDRAWAL_VALUE': () => setNewWithdrawalValue(state),
    'ETHER:POST_SAVE_NEW_WITHDRAWAL_REQUEST': () => postSaveNewWithdrawalRequest(state),
    'ETHER:POST_SAVE_NEW_WITHDRAWAL_SUCCESS': () => postSaveNewWithdrawalSuccess(state),
    'ETHER:POST_SAVE_NEW_WITHDRAWAL_FAILURE': () => postSaveNewWithdrawalFailure(state),

    'ETHER:SET_NEW_ETH_DEPOSIT_VALUE': () => setNewEthDepositValue(state),
    'ETHER:POST_SAVE_NEW_ETH_DEPOSIT_REQUEST': () => postSaveNewEthDepositRequest(state),
    'ETHER:POST_SAVE_NEW_ETH_DEPOSIT_SUCCESS': () => postSaveNewEthDepositSuccess(state),
    'ETHER:POST_SAVE_NEW_ETH_DEPOSIT_FAILURE': () => postSaveNewEthDepositFailure(state),

    'ETHER:SET_NEW_ETH_WITHDRAWAL_VALUE': () => setNewEthWithdrawalValue(state),
    'ETHER:POST_SAVE_NEW_ETH_WITHDRAWAL_REQUEST': () => postSaveNewEthWithdrawalRequest(state),
    'ETHER:POST_SAVE_NEW_ETH_WITHDRAWAL_SUCCESS': () => postSaveNewEthWithdrawalSuccess(state),
    'ETHER:POST_SAVE_NEW_ETH_WITHDRAWAL_FAILURE': () => postSaveNewEthWithdrawalFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}