import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newBet: {
    amount: 0,
    edge: 0,
  },
  savingNewBet: false,
  activeBets: [],
  activeBetsTotalCount: 0,
  activeBetsLoadOpts: {
    orderField: 'edge',
    orderDirection: 'ASC',
    offset: 0,
  },
  executedBets: [],
};

export default function etherBetReducer(state = new ImmutableMap(initialData), action) {

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


  const setActiveBetsLoadOpts = (state) => {
    return state
      .set('activeBetsLoadOpts', action.activeBetsLoadOpts);
  };

  const fetchGetActiveBetsRequest = (state) => {
    return state
      .set('gettingActiveBets', true);
  };

  const fetchGetActiveBetsSuccess = (state) => {
    let activeBets;
    if (action.loadMore) {
      activeBets = [...action.activeBets, ...state.get('activeBets')];
    }
    else {
      activeBets = action.activeBets;
    }

    return state
      .set('gettingActiveBets', false)
      .set('activeBetsTotalCount', action.activeBetsTotalCount)
      .set('activeBets', activeBets);
  };

  const fetchGetActiveBetsFailure = (state) => {
    return state
      .set('gettingActiveBets', false);
  };


  const fetchGetExecutedBetsRequest = (state) => {
    return state
      .set('gettingExecutedBets', true);
  };

  const fetchGetExecutedBetsSuccess = (state) => {
    return state
      .set('gettingExecutedBets', false)
      .set('executedBets', action.executedBets);
  };

  const fetchGetExecutedBetsFailure = (state) => {
    return state
      .set('gettingExecutedBets', false);
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

  const postCallBetRequest = (state) => {
    return state
      .set('callingBet', action.betId);
  };

  const postCallBetSuccess = (state) => {
    return state
      .set('callingBet', null);
  };

  const postCallBetFailure = (state) => {
    return state
      .set('callingBet', null);
  };


  const betCreated = (state) => {
    return state
      .set('activeBets', [action.bet, ...state.get('activeBets')])
      .set('activeBetsTotalCount', state.get('activeBetsTotalCount') + 1);
  };

  const betCanceled = (state) => {
    return state
      .set('activeBets', state.get('activeBets').filter((bet) => bet.id !== action.bet.id))
      .set('activeBetsTotalCount', state.get('activeBetsTotalCount') - 1);
  };

  const betCalled = (state) => {
    return state
      .set('activeBets', state.get('activeBets').filter((bet) => bet.id !== action.bet.id))
      .set('activeBetsTotalCount', state.get('activeBetsTotalCount') - 1);
  };

  const betExecuted = (state) => {
    return state
      .set('executedBets', [action.bet, ...state.get('executedBets')]);
  };

  const actions = {
    'ETHER:SET_NEW_BET': () => setNewBet(state),
    'ETHER:POST_SAVE_NEW_BET_REQUEST': () => postSaveNewBetRequest(state),
    'ETHER:POST_SAVE_NEW_BET_SUCCESS': () => postSaveNewBetSuccess(state),
    'ETHER:POST_SAVE_NEW_BET_FAILURE': () => postSaveNewBetFailure(state),
    'ETHER:SET_ACTIVE_BETS_LOAD_OPTS': () => setActiveBetsLoadOpts(state),
    'ETHER:FETCH_GET_ACTIVE_BETS_REQUEST': () => fetchGetActiveBetsRequest(state),
    'ETHER:FETCH_GET_ACTIVE_BETS_SUCCESS': () => fetchGetActiveBetsSuccess(state),
    'ETHER:FETCH_GET_ACTIVE_BETS_FAILURE': () => fetchGetActiveBetsFailure(state),
    'ETHER:FETCH_GET_EXECUTED_BETS_REQUEST': () => fetchGetExecutedBetsRequest(state),
    'ETHER:FETCH_GET_EXECUTED_BETS_SUCCESS': () => fetchGetExecutedBetsSuccess(state),
    'ETHER:FETCH_GET_EXECUTED_BETS_FAILURE': () => fetchGetExecutedBetsFailure(state),
    'ETHER:POST_CANCEL_BET_REQUEST': () => postCancelBetRequest(state),
    'ETHER:POST_CANCEL_BET_SUCCESS': () => postCancelBetSuccess(state),
    'ETHER:POST_CANCEL_BET_FAILURE': () => postCancelBetFailure(state),
    'ETHER:POST_CALL_BET_REQUEST': () => postCallBetRequest(state),
    'ETHER:POST_CALL_BET_SUCCESS': () => postCallBetSuccess(state),
    'ETHER:POST_CALL_BET_FAILURE': () => postCallBetFailure(state),
    'ETHER:BET_CREATED': () => betCreated(state),
    'ETHER:BET_CANCELED': () => betCanceled(state),
    'ETHER:BET_CALLED': () => betCalled(state),
    'ETHER:BET_EXECUTED': () => betExecuted(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}