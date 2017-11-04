import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newDepositValue: 0,
  savingNewDeposit: false
};

export default function balanceReducer(state = new ImmutableMap(initialData), action) {

  const fetchLoadBalanceRequest = (state) => {
    return state
      .set('loadingBalance', true);
  };

  const fetchLoadBalanceSuccess = (state) => {
    return state
      .set('loadingBalance', false)
      .set('balance', action.balance);
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

  const actions = {
    'FETCH_LOAD_BALANCE_REQUEST': () => fetchLoadBalanceRequest(state),
    'FETCH_LOAD_BALANCE_SUCCESS': () => fetchLoadBalanceSuccess(state),
    'FETCH_LOAD_BALANCE_FAILURE': () => fetchLoadBalanceFailure(state),
    'SET_NEW_DEPOSIT_VALUE': () => setNewDepositValue(state),
    'POST_SAVE_NEW_DEPOSIT_REQUEST': () => postSaveNewDepositRequest(state),
    'POST_SAVE_NEW_DEPOSIT_SUCCESS': () => postSaveNewDepositSuccess(state),
    'POST_SAVE_NEW_DEPOSIT_FAILURE': () => postSaveNewDepositFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}