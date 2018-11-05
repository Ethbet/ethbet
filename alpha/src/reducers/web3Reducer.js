import {Map as ImmutableMap} from 'immutable';

let initialData = {
  gasPriceType: "medium",
};


export default function web3Reducer(state = new ImmutableMap(initialData), action) {

  const setWeb3Loading = (state) => {
    return state
      .set('loadingWeb3', true);
  };

  const setWeb3 = (state) => {
    return state
      .set('loadingWeb3', false)
      .set('web3', action.web3)
      .set('networkName', action.networkName);
  };

  const setWeb3Failed = (state) => {
    return state
      .set('loadingWeb3', false);
  };

  const setGasPriceType = (state) => {
    return state
      .set('gasPriceType', action.gasPriceType);
  };

  const actions = {
    'SETUP_WEB3_REQUEST': () => setWeb3Loading(state),
    'SETUP_WEB3_SUCCESS': () => setWeb3(state),
    'SETUP_WEB3_FAILURE': () => setWeb3Failed(state),
    'SET_GAS_PRICE_TYPE': () => setGasPriceType(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}