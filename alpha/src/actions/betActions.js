import {action, createRequestTypes} from '../utils/actionUtils';


export const SET_NEW_BET = 'SET_NEW_BET';
export const setNewBet = data => action(SET_NEW_BET, data);

export const SAVE_NEW_BET = 'SAVE_NEW_BET';
export const saveNewBet = data => action(SAVE_NEW_BET, data);

export const POST_SAVE_NEW_BET = createRequestTypes('POST_SAVE_NEW_BET');
export const postSaveNewBet = {
  request: () => action(POST_SAVE_NEW_BET.REQUEST),
  success: (data) => action(POST_SAVE_NEW_BET.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_BET.FAILURE, error),
};


export const GET_ACTIVE_BETS = 'GET_ACTIVE_BETS';
export const getActiveBets = data => action(GET_ACTIVE_BETS, data);

export const FETCH_GET_ACTIVE_BETS = createRequestTypes('FETCH_GET_ACTIVE_BETS');
export const fetchGetActiveBets = {
  request: () => action(FETCH_GET_ACTIVE_BETS.REQUEST),
  success: (data) => action(FETCH_GET_ACTIVE_BETS.SUCCESS, data),
  failure: (error) => action(FETCH_GET_ACTIVE_BETS.FAILURE, error),
};
