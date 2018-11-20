import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import { delay } from 'redux-saga'

import * as balanceActions from '../actions/balanceActions';
import * as betActions from '../actions/betActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import balanceService from '../utils/balanceService';


function* loadInitialData(data) {
  yield put(balanceActions.loadBalances());
}

function* loadBalances(data) {
  yield put(balanceActions.fetchLoadBalance.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const balances = yield call(balanceService.loadBalances, web3);
    yield put(balanceActions.fetchLoadBalance.success(balances));
  } catch (error) {
    yield put(balanceActions.fetchLoadBalance.failure({error}));
  }
}


function* saveNewDeposit(data) {
  yield put(balanceActions.postSaveNewDeposit.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newDepositValue = yield select(state => state.balanceStore.get("newDepositValue"));
    let parseNewDepositValue = parseFloat(newDepositValue) * 100;   // 2 decimals for EBET

    const results = yield call(balanceService.deposit, web3, parseNewDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(balanceActions.postSaveNewDeposit.success({results}));

    console.log("saveNewDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(balanceActions.postSaveNewDeposit.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* saveNewWithdrawal(data) {
  yield put(balanceActions.postSaveNewWithdrawal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newWithdrawalValue = yield select(state => state.balanceStore.get("newWithdrawalValue"));
    let parseNewWithdrawalValue = parseFloat(newWithdrawalValue) * 100;   // 2 decimals for EBET

    const results = yield call(balanceService.withdraw, web3, parseNewWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(balanceActions.postSaveNewWithdrawal.success({results}));

    console.log("saveNewWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(balanceActions.postSaveNewWithdrawal.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewEthDeposit(data) {
  yield put(balanceActions.postSaveNewEthDeposit.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newEthDepositValue = yield select(state => state.balanceStore.get("newEthDepositValue"));
    let parseNewEthDepositValue = parseFloat(newEthDepositValue);

    const results = yield call(balanceService.depositEth, web3, parseNewEthDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(balanceActions.postSaveNewEthDeposit.success({ results }));

    console.log("saveNewEthDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new ETH deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(balanceActions.postSaveNewEthDeposit.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save ETH deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewEthWithdrawal(data) {
  yield put(balanceActions.postSaveNewEthWithdrawal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newEthWithdrawalValue = yield select(state => state.balanceStore.get("newEthWithdrawalValue"));
    let parseNewEthWithdrawalValue = parseFloat(newEthWithdrawalValue);

    const results = yield call(balanceService.withdrawEth, web3, parseNewEthWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(balanceActions.postSaveNewEthWithdrawal.success({ results }));

    console.log("saveNewEthWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new ETH withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(balanceActions.postSaveNewEthWithdrawal.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save ETH withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* watchEbetLoadInitialData() {
  yield takeEvery(web3Actions.EBET_LOAD_INITIAL_DATA, loadInitialData);
}

function* watchLoadBalances() {
  yield takeEvery(balanceActions.LOAD_BALANCES, loadBalances);
}

function* watchSaveNewDeposit() {
  yield takeEvery(balanceActions.SAVE_NEW_DEPOSIT, saveNewDeposit);
}

function* watchPostSaveNewDepositSuccess() {
  yield takeEvery(balanceActions.POST_SAVE_NEW_DEPOSIT.SUCCESS, loadBalances);
}

function* watchSaveNewWithdrawal() {
  yield takeEvery(balanceActions.SAVE_NEW_WITHDRAWAL, saveNewWithdrawal);
}

function* watchPostSaveNewWithdrawalSuccess() {
  yield takeEvery(balanceActions.POST_SAVE_NEW_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchSaveNewEthDeposit() {
  yield takeEvery(balanceActions.SAVE_NEW_ETH_DEPOSIT, saveNewEthDeposit);
}

function* watchPostSaveNewEthDepositSuccess() {
  yield takeEvery(balanceActions.POST_SAVE_NEW_ETH_DEPOSIT.SUCCESS, loadBalances);
}

function* watchSaveNewEthWithdrawal() {
  yield takeEvery(balanceActions.SAVE_NEW_ETH_WITHDRAWAL, saveNewEthWithdrawal);
}

function* watchPostSaveNewEthWithdrawalSuccess() {
  yield takeEvery(balanceActions.POST_SAVE_NEW_ETH_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchPostSaveNewBetSuccess() {
  yield takeEvery(betActions.POST_SAVE_NEW_BET.SUCCESS, loadBalances);
}

function* watchPostCancelBetSuccess() {
  yield takeEvery(betActions.POST_CANCEL_BET.SUCCESS, loadBalances);
}

function* watchPostCallBetSuccess() {
  yield takeEvery(betActions.POST_CALL_BET.SUCCESS, loadBalances);
}

export default function* balanceSaga() {
  yield all([
    watchEbetLoadInitialData(),
    watchLoadBalances(),
    watchSaveNewDeposit(),
    watchPostSaveNewDepositSuccess(),  
    watchSaveNewWithdrawal(),
    watchPostSaveNewWithdrawalSuccess(),
    watchSaveNewEthDeposit(),
    watchPostSaveNewEthDepositSuccess(),
    watchSaveNewEthWithdrawal(),
    watchPostSaveNewEthWithdrawalSuccess(),    
    watchPostSaveNewBetSuccess(),
    watchPostCancelBetSuccess(),
    watchPostCallBetSuccess(),
  ]);
}