import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newBet: {
    amount: 0,
    edge: 0,
  },
  savingNewBet: false,
  activeBets: []
};

export default function betReducer(state = new ImmutableMap(initialData), action) {

  const setNewBet = (state) => {
    return state
      .set('newBet', action.newBet);
  };

  const postSaveNewBetRequest = (state) => {
    return state
      .set('savingNewBet', true);
  };

  const postSaveNewBetSuccess = (state) => {
    return state
      .set('savingNewBet', false)
      .set('newBet', initialData.newBet);
  };

  const postSaveNewBetFailure = (state) => {
    return state
      .set('savingNewBet', false);
  };


  const fetchGetActiveBetsRequest = (state) => {
    return state
      .set('gettingActiveBets', true);
  };

  const fetchGetActiveBetsSuccess = (state) => {
    return state
      .set('gettingActiveBets', false)
      .set('activeBets', action.activeBets);
  };

  const fetchGetActiveBetsFailure = (state) => {
    return state
      .set('gettingActiveBets', false);
  };


  const postCancelBetRequest = (state) => {
    return state
      .set('cancelingBet', action.betId);
  };

  const postCancelBetSuccess = (state) => {
    return state
      .set('cancelingBet', null);
  };

  const postCancelBetFailure = (state) => {
    return state
      .set('cancelingBet', null);
  };
  
  
  const betCreated = (state) => {
    return state
      .set('activeBets', [action.bet, ...state.get('activeBets')]);
  };

  const betCanceled = (state) => {
    return state
      .set('activeBets', state.get('activeBets').filter((bet) => bet.id !== action.bet.id));
  };

  const actions = {
    'SET_NEW_BET': () => setNewBet(state),
    'POST_SAVE_NEW_BET_REQUEST': () => postSaveNewBetRequest(state),
    'POST_SAVE_NEW_BET_SUCCESS': () => postSaveNewBetSuccess(state),
    'POST_SAVE_NEW_BET_FAILURE': () => postSaveNewBetFailure(state),
    'FETCH_GET_ACTIVE_BETS_REQUEST': () => fetchGetActiveBetsRequest(state),
    'FETCH_GET_ACTIVE_BETS_SUCCESS': () => fetchGetActiveBetsSuccess(state),
    'FETCH_GET_ACTIVE_BETS_FAILURE': () => fetchGetActiveBetsFailure(state),
    'POST_CANCEL_BET_REQUEST': () => postCancelBetRequest(state),
    'POST_CANCEL_BET_SUCCESS': () => postCancelBetSuccess(state),
    'POST_CANCEL_BET_FAILURE': () => postCancelBetFailure(state),
    'BET_CREATED': () => betCreated(state),
    'BET_CANCELED': () => betCanceled(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}