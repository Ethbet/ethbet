import {call, put, all, takeEvery, select} from 'redux-saga/effects';

import _ from 'lodash';

import * as betActions from '../actions/betActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import betService from '../utils/betService';

function* loadInitialData(data) {
  yield all([
    put(betActions.getActiveBets()),
    put(betActions.getExecutedBets()),
    put(betActions.getUserActiveBetsCount()),
  ])
}

function* saveNewBet(data) {
  yield put(betActions.postSaveNewBet.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const gasPriceType = yield select(state => state.web3Store.get("gasPriceType"));
    const newBet = yield select(state => state.betStore.get("newBet"));

    yield call(betService.makeBet, web3, gasPriceType, newBet);

    yield put(betActions.postSaveNewBet.success());

    yield put(notificationActions.successMessage('bet creation ongoing, you will be notified when it is complete ...'));
  } catch (error) {
    yield put(betActions.postSaveNewBet.failure({ error }));
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


function* notifyBetCreated(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  const bet = data.bet;

  // notify if creator
  if (_.get(web3, 'eth.defaultAccount') === bet.user) {
    console.log("betCreated ID:", bet.id);
    yield put(notificationActions.successMessage(`new bet created. ID: ${bet.id}, Amount: ${bet.amount / 100}, Edge: ${bet.edge}`));
  }
}

function* getActiveBets(data) {
  yield put(betActions.fetchGetActiveBets.request());
  try {
    const opts = yield select(state => state.betStore.get("activeBetsLoadOpts"));
    const results = yield call(betService.getActiveBets, opts);

    let loadMore = opts.offset > 0;
    yield put(betActions.fetchGetActiveBets.success({
      activeBets: results.bets,
      activeBetsTotalCount: results.count,
      loadMore: loadMore
    }));
  } catch (error) {
    yield put(betActions.fetchGetActiveBets.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get active bets',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* getUserActiveBetsCount(data) {
  yield put(betActions.fetchGetUserActiveBetsCount.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const count = yield call(betService.getUserActiveBetsCount, web3);

    yield put(betActions.fetchGetUserActiveBetsCount.success({ count }));
  } catch (error) {
    yield put(betActions.fetchGetUserActiveBetsCount.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get user active bets count',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* getExecutedBets(data) {
  yield put(betActions.fetchGetExecutedBets.request());
  try {
    const executedBets = yield call(betService.getExecutedBets);
    yield put(betActions.fetchGetExecutedBets.success({ executedBets }));
  } catch (error) {
    yield put(betActions.fetchGetExecutedBets.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get executed bets',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* getBetInfo(data) {
  yield put(betActions.fetchGetBetInfo.request({ id: data.id }));
  try {
    const bet = yield call(betService.getBetInfo, data.id);
    yield put(betActions.fetchGetBetInfo.success({ bet }));
  } catch (error) {
    yield put(betActions.fetchGetBetInfo.failure({ error }));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get bet info',
        message: error.message,
        position: 'br'
      }
    }));
  }
}


function* cancelBet(data) {
  yield put(betActions.postCancelBet.request({ betId: data.id }));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const gasPriceType = yield select(state => state.web3Store.get("gasPriceType"));

    yield call(betService.cancelBet, web3, gasPriceType, data.id);

    yield put(betActions.postCancelBet.success({}));

    yield put(notificationActions.successMessage('bet cancellation ongoing, you will be notified when it is complete ...'));
  } catch (error) {
    yield put(betActions.postCancelBet.failure({ error }));
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

function* notifyBetCanceled(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  const bet = data.bet;

  // notify if creator
  if (_.get(web3, 'eth.defaultAccount') === bet.user) {
    console.log("betCanceled ID:", bet.id);
    yield put(notificationActions.successMessage(`bet canceled. ID: ${bet.id}`));
  }
}


function* callBet(data) {
  yield put(betActions.postCallBet.request({ betId: data.id }));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const gasPriceType = yield select(state => state.web3Store.get("gasPriceType"));

    yield call(betService.callBet, web3, gasPriceType, data.id, data.amount);

    yield put(betActions.postCallBet.success({}));

    yield put(notificationActions.successMessage('bet call ongoing, you will be notified when it is complete ...'));
  } catch (error) {
    yield put(betActions.postCallBet.failure({ error }));
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

function* notifyBetCalled(actionData) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  const bet = actionData.data.bet;

  // notify if caller
  if (_.get(web3, 'eth.defaultAccount') === bet.callerUser) {
    console.log("betCalled ID:", bet.id);

    yield put(notificationActions.success({
      notification: {
        title: 'Seed Generated',
        message: actionData.data.seedMessage,
        position: 'br'
      }
    }));
    yield put(notificationActions.success({
      notification: {
        title: 'Bet Results',
        message: actionData.data.resultMessage,
        position: 'br'
      }
    }));
  }
}


function* watchSaveNewBet() {
  yield takeEvery(betActions.SAVE_NEW_BET, saveNewBet);
}

function* watchBetCreated() {
  yield takeEvery(betActions.BET_CREATED, notifyBetCreated);
  yield takeEvery(betActions.BET_CREATED, getUserActiveBetsCount);
}

function* watchGetActiveBets() {
  yield takeEvery(betActions.GET_ACTIVE_BETS, getActiveBets);
}

function* watchGetUserActiveBetsCount() {
  yield takeEvery(betActions.GET_USER_ACTIVE_BETS_COUNT, getUserActiveBetsCount);
}

function* watchGetExecutedBets() {
  yield takeEvery(betActions.GET_EXECUTED_BETS, getExecutedBets);
}

function* watchGetBetInfo() {
  yield takeEvery(betActions.GET_BET_INFO, getBetInfo);
}

function* watchCancelBet() {
  yield takeEvery(betActions.CANCEL_BET, cancelBet);
}

function* watchBetCanceled() {
  yield takeEvery(betActions.BET_CANCELED, notifyBetCanceled);
  yield takeEvery(betActions.BET_CANCELED, getUserActiveBetsCount);
}

function* watchCallBet() {
  yield takeEvery(betActions.CALL_BET, callBet);
}

function* watchBetCalled() {
  yield takeEvery(betActions.BET_CALLED, notifyBetCalled);
  yield takeEvery(betActions.BET_CALLED, getUserActiveBetsCount);
}

function* watchEbetLoadInitialData() {
  yield takeEvery(web3Actions.EBET_LOAD_INITIAL_DATA, loadInitialData);
}

export default function* betSaga() {
  yield all([
    watchEbetLoadInitialData(),
    watchSaveNewBet(),
    watchBetCreated(),
    watchGetActiveBets(),
    watchGetUserActiveBetsCount(),
    watchGetExecutedBets(),
    watchGetBetInfo(),
    watchCancelBet(),
    watchBetCanceled(),
    watchCallBet(),
    watchBetCalled(),
  ]);
}