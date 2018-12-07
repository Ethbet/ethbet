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
  betsInfo: {},
  userActiveBetsCount: null
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


  const fetchGetUserActiveBetsCountRequest = (state) => {
    return state
      .set('gettingUserActiveBetsCount', true);
  };

  const fetchGetUserActiveBetsCountSuccess = (state) => {
    return state
      .set('gettingUserActiveBetsCount', false)
      .set('userActiveBetsCount', action.count);
  };

  const fetchGetUserActiveBetsCountFailure = (state) => {
    return state
      .set('gettingUserActiveBetsCount', false);
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

  const fetchGetBetInfoRequest = (state) => {
    return state
      .set('gettingBetInfo', action.id);
  };

  const fetchGetBetInfoSuccess = (state) => {
    let betsInfo = state.get('betsInfo');
    let bet = action.bet;
    betsInfo[bet.id] = bet;

    return state
      .set('gettingBetInfo', false)
      .set('betsInfo', betsInfo);
  };

  const fetchGetBetInfoFailure = (state) => {
    return state
      .set('gettingBetInfo', false);
  };

  const postCancelBetRequest = (state) => {
    return state
      .set('cancelingBet', action.betId);
  };

  const postCancelBetFailure = (state) => {
    return state
      .set('cancelingBet', null);
  };

  const postCallBetRequest = (state) => {
    return state
      .set('callingBet', action.betId);
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
      .set('cancelingBet', null)
      .set('activeBets', state.get('activeBets').filter((bet) => bet.id !== action.bet.id))
      .set('activeBetsTotalCount', state.get('activeBetsTotalCount') - 1);
  };

  const betCalled = (state) => {
    let bet = action.data.bet;

    return state
      .set('callingBet', null)
      .set('activeBets', state.get('activeBets').filter((activeBet) => activeBet.id !== bet.id))
      .set('activeBetsTotalCount', state.get('activeBetsTotalCount') - 1)
      .set('executedBets', [bet, ...state.get('executedBets')]);
  };

  const actions = {
    'SET_NEW_BET': () => setNewBet(state),
    'POST_SAVE_NEW_BET_REQUEST': () => postSaveNewBetRequest(state),
    'POST_SAVE_NEW_BET_SUCCESS': () => postSaveNewBetSuccess(state),
    'POST_SAVE_NEW_BET_FAILURE': () => postSaveNewBetFailure(state),
    'SET_ACTIVE_BETS_LOAD_OPTS': () => setActiveBetsLoadOpts(state),
    'FETCH_GET_ACTIVE_BETS_REQUEST': () => fetchGetActiveBetsRequest(state),
    'FETCH_GET_ACTIVE_BETS_SUCCESS': () => fetchGetActiveBetsSuccess(state),
    'FETCH_GET_ACTIVE_BETS_FAILURE': () => fetchGetActiveBetsFailure(state),
    'FETCH_GET_USER_ACTIVE_BETS_COUNT_REQUEST': () => fetchGetUserActiveBetsCountRequest(state),
    'FETCH_GET_USER_ACTIVE_BETS_COUNT_SUCCESS': () => fetchGetUserActiveBetsCountSuccess(state),
    'FETCH_GET_USER_ACTIVE_BETS_COUNT_FAILURE': () => fetchGetUserActiveBetsCountFailure(state),
    'FETCH_GET_EXECUTED_BETS_REQUEST': () => fetchGetExecutedBetsRequest(state),
    'FETCH_GET_EXECUTED_BETS_SUCCESS': () => fetchGetExecutedBetsSuccess(state),
    'FETCH_GET_EXECUTED_BETS_FAILURE': () => fetchGetExecutedBetsFailure(state),
    'FETCH_GET_BET_INFO_REQUEST': () => fetchGetBetInfoRequest(state),
    'FETCH_GET_BET_INFO_SUCCESS': () => fetchGetBetInfoSuccess(state),
    'FETCH_GET_BET_INFO_FAILURE': () => fetchGetBetInfoFailure(state),
    'POST_CANCEL_BET_REQUEST': () => postCancelBetRequest(state),
    'POST_CANCEL_BET_FAILURE': () => postCancelBetFailure(state),
    'POST_CALL_BET_REQUEST': () => postCallBetRequest(state),
    'POST_CALL_BET_FAILURE': () => postCallBetFailure(state),
    'BET_CREATED': () => betCreated(state),
    'BET_CANCELED': () => betCanceled(state),
    'BET_CALLED': () => betCalled(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}