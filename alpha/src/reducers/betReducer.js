import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newBet: {
    amount: 0,
    edge: 0,
  },
  savingNewBet: false
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
      .set('savingNewDeposit', false);
  };

  const actions = {
    'SET_NEW_BET': () => setNewBet(state),
    'POST_SAVE_NEW_BET_REQUEST': () => postSaveNewBetRequest(state),
    'POST_SAVE_NEW_BET_SUCCESS': () => postSaveNewBetSuccess(state),
    'POST_SAVE_NEW_BET_FAILURE': () => postSaveNewBetFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}