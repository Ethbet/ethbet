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
