import {action, createRequestTypes} from '../utils/actionUtils';

export const INIT_WEB3 = 'INIT_WEB3';
export const initWeb3 = data => action(INIT_WEB3, data);

export const SETUP_WEB3 = createRequestTypes('SETUP_WEB3');
export const setupWeb3 = {
  request: () => action(SETUP_WEB3.REQUEST),
  success: (data) => action(SETUP_WEB3.SUCCESS, data),
  failure: (error) => action(SETUP_WEB3.FAILURE, error),
};

export const EBET_LOAD_INITIAL_DATA = 'EBET_LOAD_INITIAL_DATA';
export const ebetLoadInitialData = data => action(EBET_LOAD_INITIAL_DATA, data);

export const ETHER_LOAD_INITIAL_DATA = 'ETHER_LOAD_INITIAL_DATA';
export const etherLoadInitialData = data => action(ETHER_LOAD_INITIAL_DATA, data);