import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

const _ = require('lodash');

import * as etherBetActions from '../actions/etherBetActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import etherBetService from '../utils/etherBetService';

function* loadInitialData(data) {
  yield all([
    put(etherBetActions.getActiveBets()),
    put(etherBetActions.getExecutedBets()),
    put(etherBetActions.getPendingBets())
  ])
}

function* saveNewBet(data) {
  yield put(etherBetActions.postSaveNewBet.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newBet = yield select(state => state.etherBetStore.get("newBet"));

    const results = yield call(etherBetService.makeBet, web3, newBet);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBetActions.postSaveNewBet.success({results}));

    console.log("saveNewBet TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new bet saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBetActions.postSaveNewBet.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save bet',
        // handle axios error format if available
        message: _.get(error, 'response.data.message') || error.message,
        position: 'br'
      }
    }));
  }
}

function* getActiveBets(data) {
  yield put(etherBetActions.fetchGetActiveBets.request());
  try {
    const opts = yield select(state => state.etherBetStore.get("activeBetsLoadOpts"));
    const results = yield call(etherBetService.getActiveBets, opts);

    let loadMore = opts.offset > 0;
    yield put(etherBetActions.fetchGetActiveBets.success({
      activeBets: results.bets,
      activeBetsTotalCount: results.count,
      loadMore: loadMore
    }));
  } catch (error) {
    yield put(etherBetActions.fetchGetActiveBets.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get active bets',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* getExecutedBets(data) {
  yield put(etherBetActions.fetchGetExecutedBets.request());
  try {
    const executedBets = yield call(etherBetService.getExecutedBets);
    yield put(etherBetActions.fetchGetExecutedBets.success({executedBets}));
  } catch (error) {
    yield put(etherBetActions.fetchGetExecutedBets.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get executed bets',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* getPendingBets(data) {
  yield put(etherBetActions.fetchGetPendingBets.request());
  try {
    const pendingBets = yield call(etherBetService.getPendingBets);
    yield put(etherBetActions.fetchGetPendingBets.success({pendingBets}));
  } catch (error) {
    yield put(etherBetActions.fetchGetPendingBets.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get pending bets',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* cancelBet(data) {
  yield put(etherBetActions.postCancelBet.request({betId: data.id}));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(etherBetService.cancelBet, web3, data.id);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBetActions.postCancelBet.success({results}));

    console.log("cancelBet TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'bet canceled successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBetActions.postCancelBet.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to cancel bet',
        // handle axios error format if available
        message: _.get(error, 'response.data.message') || error.message,
        position: 'br'
      }
    }));
  }
}


function* callBet(data) {
  yield put(etherBetActions.postCallBet.request({betId: data.id}));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(etherBetService.callBet, web3, data.id);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(etherBetActions.postCallBet.success({results}));

    console.log("callBet TX", results.data.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'Bet Initialized',
        message: "The bet was initialized and should be executed in the next few minutes ...",
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(etherBetActions.postCallBet.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to call bet',
        // handle axios error format if available
        message: _.get(error, 'response.data.message') || error.message,
        position: 'br'
      }
    }));
  }
}


function* watchSaveNewBet() {
  yield takeEvery(etherBetActions.SAVE_NEW_BET, saveNewBet);
}

function* watchGetActiveBets() {
  yield takeEvery(etherBetActions.GET_ACTIVE_BETS, getActiveBets);
}

function* watchGetExecutedBets() {
  yield takeEvery(etherBetActions.GET_EXECUTED_BETS, getExecutedBets);
}

function* watchGetPendingBets() {
  yield takeEvery(etherBetActions.GET_PENDING_BETS, getPendingBets);
}

function* watchCancelBet() {
  yield takeEvery(etherBetActions.CANCEL_BET, cancelBet);
}

function* watchCallBet() {
  yield takeEvery(etherBetActions.CALL_BET, callBet);
}

function* watchEtherLoadInitialData() {
  yield takeEvery(web3Actions.ETHER_LOAD_INITIAL_DATA, loadInitialData);
}

export default function* betSaga() {
  yield all([
    watchEtherLoadInitialData(),
    watchSaveNewBet(),
    watchGetActiveBets(),
    watchGetExecutedBets(),
    watchGetPendingBets(),
    watchCancelBet(),
    watchCallBet(),
  ]);
}