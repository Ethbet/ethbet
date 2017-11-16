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

export const BET_CREATED = 'BET_CREATED';
export const betCreated = data => action(BET_CREATED, data);


export const CANCEL_BET = 'CANCEL_BET';
export const cancelBet = data => action(CANCEL_BET, data);

export const POST_CANCEL_BET = createRequestTypes('POST_CANCEL_BET');
export const postCancelBet = {
  request: (data) => action(POST_CANCEL_BET.REQUEST,data),
  success: (data) => action(POST_CANCEL_BET.SUCCESS, data),
  failure: (error) => action(POST_CANCEL_BET.FAILURE, error),
};

export const BET_CANCELED = 'BET_CANCELED';
export const betCanceled = data => action(BET_CANCELED, data);
