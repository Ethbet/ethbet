import {action, createRequestTypes} from '../utils/actionUtils';

export const LOAD_BALANCE = 'LOAD_BALANCE';
export const loadBalance = data => action(LOAD_BALANCE, data);

export const FETCH_LOAD_BALANCE = createRequestTypes('FETCH_LOAD_BALANCE');
export const fetchLoadBalance = {
  request: () => action(FETCH_LOAD_BALANCE.REQUEST),
  success: (data) => action(FETCH_LOAD_BALANCE.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_BALANCE.FAILURE, error),
};