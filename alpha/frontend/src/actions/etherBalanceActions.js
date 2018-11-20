import {action, createRequestTypes} from '../utils/actionUtils';

export const LOAD_BALANCES = 'ETHER:LOAD_BALANCES';
export const loadBalances = data => action(LOAD_BALANCES, data);

export const FETCH_LOAD_BALANCE = createRequestTypes('ETHER:FETCH_LOAD_BALANCE');
export const fetchLoadBalance = {
  request: () => action(FETCH_LOAD_BALANCE.REQUEST),
  success: (data) => action(FETCH_LOAD_BALANCE.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_BALANCE.FAILURE, error),
};


export const SET_NEW_DEPOSIT_VALUE = 'ETHER:SET_NEW_DEPOSIT_VALUE';
export const setNewDepositValue = data => action(SET_NEW_DEPOSIT_VALUE, data);

export const SAVE_NEW_DEPOSIT = 'ETHER:SAVE_NEW_DEPOSIT';
export const saveNewDeposit = data => action(SAVE_NEW_DEPOSIT, data);

export const POST_SAVE_NEW_DEPOSIT = createRequestTypes('ETHER:POST_SAVE_NEW_DEPOSIT');
export const postSaveNewDeposit = {
  request: () => action(POST_SAVE_NEW_DEPOSIT.REQUEST),
  success: (data) => action(POST_SAVE_NEW_DEPOSIT.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_DEPOSIT.FAILURE, error),
};


export const SET_NEW_WITHDRAWAL_VALUE = 'ETHER:SET_NEW_WITHDRAWAL_VALUE';
export const setNewWithdrawalValue = data => action(SET_NEW_WITHDRAWAL_VALUE, data);

export const SAVE_NEW_WITHDRAWAL = 'ETHER:SAVE_NEW_WITHDRAWAL';
export const saveNewWithdrawal = data => action(SAVE_NEW_WITHDRAWAL, data);

export const POST_SAVE_NEW_WITHDRAWAL = createRequestTypes('ETHER:POST_SAVE_NEW_WITHDRAWAL');
export const postSaveNewWithdrawal = {
  request: () => action(POST_SAVE_NEW_WITHDRAWAL.REQUEST),
  success: (data) => action(POST_SAVE_NEW_WITHDRAWAL.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_WITHDRAWAL.FAILURE, error),
};


export const SET_NEW_ETH_DEPOSIT_VALUE = 'ETHER:SET_NEW_ETH_DEPOSIT_VALUE';
export const setNewEthDepositValue = data => action(SET_NEW_ETH_DEPOSIT_VALUE, data);

export const SAVE_NEW_ETH_DEPOSIT = 'ETHER:SAVE_NEW_ETH_DEPOSIT';
export const saveNewEthDeposit = data => action(SAVE_NEW_ETH_DEPOSIT, data);

export const POST_SAVE_NEW_ETH_DEPOSIT = createRequestTypes('ETHER:POST_SAVE_NEW_ETH_DEPOSIT');
export const postSaveNewEthDeposit = {
  request: () => action(POST_SAVE_NEW_ETH_DEPOSIT.REQUEST),
  success: (data) => action(POST_SAVE_NEW_ETH_DEPOSIT.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_ETH_DEPOSIT.FAILURE, error),
};


export const SET_NEW_ETH_WITHDRAWAL_VALUE = 'ETHER:SET_NEW_ETH_WITHDRAWAL_VALUE';
export const setNewEthWithdrawalValue = data => action(SET_NEW_ETH_WITHDRAWAL_VALUE, data);

export const SAVE_NEW_ETH_WITHDRAWAL = 'ETHER:SAVE_NEW_ETH_WITHDRAWAL';
export const saveNewEthWithdrawal = data => action(SAVE_NEW_ETH_WITHDRAWAL, data);

export const POST_SAVE_NEW_ETH_WITHDRAWAL = createRequestTypes('ETHER:POST_SAVE_NEW_ETH_WITHDRAWAL');
export const postSaveNewEthWithdrawal = {
  request: () => action(POST_SAVE_NEW_ETH_WITHDRAWAL.REQUEST),
  success: (data) => action(POST_SAVE_NEW_ETH_WITHDRAWAL.SUCCESS, data),
  failure: (error) => action(POST_SAVE_NEW_ETH_WITHDRAWAL.FAILURE, error),
};