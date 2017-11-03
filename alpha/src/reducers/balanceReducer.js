import {Map as ImmutableMap} from 'immutable';


let initialData = {
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

  const actions = {
    'FETCH_LOAD_BALANCE_REQUEST': () => fetchLoadBalanceRequest(state),
    'FETCH_LOAD_BALANCE_SUCCESS': () => fetchLoadBalanceSuccess(state),
    'FETCH_LOAD_BALANCE_FAILURE': () => fetchLoadBalanceFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}