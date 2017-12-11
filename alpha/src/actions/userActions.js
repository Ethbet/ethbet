import {action, createRequestTypes} from '../utils/actionUtils';


export const SET_NEW_USER = 'SET_NEW_USER';
export const setNewUser = data => action(SET_NEW_USER, data);

export const SAVE_NEW_USER = 'SAVE_NEW_USER';
export const saveNewUser = data => action(SAVE_NEW_USER, data);

export const POST_SAVE_NEW_USER = createRequestTypes('POST_SAVE_NEW_USER');
export const postSaveNewUser = {
  request: () => action(POST_SAVE_NEW_USER.REQUEST),
  success: (data) => action(POST_SAVE_NEW_USER.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_USER.FAILURE, error),
};

export const LOAD_CURRENT_USER = 'LOAD_CURRENT_USER';
export const loadCurrentUser = data => action(LOAD_CURRENT_USER, data);

export const FETCH_LOAD_CURRENT_USER = createRequestTypes('FETCH_LOAD_CURRENT_USER');
export const fetchLoadCurrentUser = {
  request: () => action(FETCH_LOAD_CURRENT_USER.REQUEST),
  success: (data) => action(FETCH_LOAD_CURRENT_USER.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_CURRENT_USER.FAILURE, error),
};