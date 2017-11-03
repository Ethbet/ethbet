import {call, put, all, takeEvery, select} from 'redux-saga/effects';

import * as balanceActions from '../actions/balanceActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import balanceService from '../utils/balanceService';


function* loadBalance(data) {
  yield put(balanceActions.fetchLoadBalance.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const balance = yield call(balanceService.loadBalance, web3);
    yield put(balanceActions.fetchLoadBalance.success({balance}));
  } catch (error) {
    yield put(balanceActions.fetchLoadBalance.failure({error}));
  }
}

function* loadInitialData(data) {
  yield put(balanceActions.loadBalance());
}

function* watchLoadUsersData() {
  yield takeEvery(balanceActions.LOAD_BALANCE, loadBalance);
}

function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadInitialData);
}

export default function* balanceSaga() {
  yield all([
    watchLoadUsersData(),
    watchSetupWeb3Success(),
  ]);
}