import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

import * as etherBalanceActions from '../actions/etherBalanceActions';
import * as etherBetActions from '../actions/etherBetActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import etherBalanceService from '../utils/etherBalanceService';


function* loadInitialData(data) {
  yield put(etherBalanceActions.loadBalances());
}

function* loadBalances(data) {
  yield put(etherBalanceActions.fetchLoadBalance.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const balances = yield call(etherBalanceService.loadBalances, web3);
    yield put(etherBalanceActions.fetchLoadBalance.success(balances));
  } catch (error) {
    yield put(etherBalanceActions.fetchLoadBalance.failure({ error }));
  }
}

function* saveNewDeposit(data) {
  yield put(etherBalanceActions.postSaveNewDeposit.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newDepositValue = yield select(state => state.etherBalanceStore.get("newDepositValue"));
    let parseNewDepositValue = parseFloat(newDepositValue) * 100;   // 2 decimals for EBET

    const results = yield call(etherBalanceService.deposit, web3, parseNewDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBalanceActions.postSaveNewDeposit.success({ results }));

    console.log("saveNewDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new EBET deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBalanceActions.postSaveNewDeposit.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save EBET deposit',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* saveNewWithdrawal(data) {
  yield put(etherBalanceActions.postSaveNewWithdrawal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newWithdrawalValue = yield select(state => state.etherBalanceStore.get("newWithdrawalValue"));
    let parseNewWithdrawalValue = parseFloat(newWithdrawalValue) * 100;   // 2 decimals for EBET

    const results = yield call(etherBalanceService.withdraw, web3, parseNewWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBalanceActions.postSaveNewWithdrawal.success({ results }));

    console.log("saveNewWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new EBET withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBalanceActions.postSaveNewWithdrawal.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save EBET withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* saveNewEthDeposit(data) {
  yield put(etherBalanceActions.postSaveNewEthDeposit.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newEthDepositValue = yield select(state => state.etherBalanceStore.get("newEthDepositValue"));
    let parseNewEthDepositValue = parseFloat(newEthDepositValue);

    const results = yield call(etherBalanceService.depositEth, web3, parseNewEthDepositValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBalanceActions.postSaveNewEthDeposit.success({ results }));

    console.log("saveNewEthDeposit TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new ETH deposit saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBalanceActions.postSaveNewEthDeposit.failure({ error }));
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
  yield put(etherBalanceActions.postSaveNewEthWithdrawal.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const newEthWithdrawalValue = yield select(state => state.etherBalanceStore.get("newEthWithdrawalValue"));
    let parseNewEthWithdrawalValue = parseFloat(newEthWithdrawalValue);

    const results = yield call(etherBalanceService.withdrawEth, web3, parseNewEthWithdrawalValue);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBalanceActions.postSaveNewEthWithdrawal.success({ results }));

    console.log("saveNewEthWithdrawal TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new ETH withdrawal saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBalanceActions.postSaveNewEthWithdrawal.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save ETH withdrawal',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* watchEtherLoadInitialData() {
  yield takeEvery(web3Actions.ETHER_LOAD_INITIAL_DATA, loadInitialData);
}

function* watchLoadBalances() {
  yield takeEvery(etherBalanceActions.LOAD_BALANCES, loadBalances);
}

function* watchSaveNewDeposit() {
  yield takeEvery(etherBalanceActions.SAVE_NEW_DEPOSIT, saveNewDeposit);
}

function* watchPostSaveNewDepositSuccess() {
  yield takeEvery(etherBalanceActions.POST_SAVE_NEW_DEPOSIT.SUCCESS, loadBalances);
}

function* watchSaveNewWithdrawal() {
  yield takeEvery(etherBalanceActions.SAVE_NEW_WITHDRAWAL, saveNewWithdrawal);
}

function* watchPostSaveNewWithdrawalSuccess() {
  yield takeEvery(etherBalanceActions.POST_SAVE_NEW_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchSaveNewEthDeposit() {
  yield takeEvery(etherBalanceActions.SAVE_NEW_ETH_DEPOSIT, saveNewEthDeposit);
}

function* watchPostSaveNewEthDepositSuccess() {
  yield takeEvery(etherBalanceActions.POST_SAVE_NEW_ETH_DEPOSIT.SUCCESS, loadBalances);
}

function* watchSaveNewEthWithdrawal() {
  yield takeEvery(etherBalanceActions.SAVE_NEW_ETH_WITHDRAWAL, saveNewEthWithdrawal);
}

function* watchPostSaveNewEthWithdrawalSuccess() {
  yield takeEvery(etherBalanceActions.POST_SAVE_NEW_ETH_WITHDRAWAL.SUCCESS, loadBalances);
}

function* watchPostSaveNewBetSuccess() {
  yield takeEvery(etherBetActions.POST_SAVE_NEW_BET.SUCCESS, loadBalances);
}

function* watchPostCancelBetSuccess() {
  yield takeEvery(etherBetActions.POST_CANCEL_BET.SUCCESS, loadBalances);
}

function* watchPostCallBetSuccess() {
  yield takeEvery(etherBetActions.POST_CALL_BET.SUCCESS, loadBalances);
}

export default function* etherBalanceSaga() {
  yield all([
    watchEtherLoadInitialData(),
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