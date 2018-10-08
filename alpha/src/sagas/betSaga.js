import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

const _ = require('lodash');

import * as betActions from '../actions/betActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import betService from '../utils/betService';

function* loadInitialData(data) {
  yield all([
    put(betActions.getActiveBets()),
    put(betActions.getExecutedBets())
  ])
}

function* saveNewBet(data) {
  yield put(betActions.postSaveNewBet.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newBet = yield select(state => state.betStore.get("newBet"));

    yield call(betService.makeBet, web3, newBet);

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

    yield call(betService.cancelBet, web3, data.id);

    yield put(betActions.postCancelBet.success({  }));

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

    const results = yield call(betService.callBet, web3, data.id, data.amount);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(betActions.postCallBet.success({ results }));

    console.log("callBet TX", results.data.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'Seed Generated',
        message: results.data.seedMessage,
        position: 'br'
      }
    }));
    yield put(notificationActions.success({
      notification: {
        title: 'Bet Results',
        message: results.data.resultMessage,
        position: 'br'
      }
    }));
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


function* watchSaveNewBet() {
  yield takeEvery(betActions.SAVE_NEW_BET, saveNewBet);
}

function* watchBetCreated() {
  yield takeEvery(betActions.BET_CREATED, notifyBetCreated);
}

function* watchGetActiveBets() {
  yield takeEvery(betActions.GET_ACTIVE_BETS, getActiveBets);
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
}

function* watchCallBet() {
  yield takeEvery(betActions.CALL_BET, callBet);
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
    watchGetExecutedBets(),
    watchGetBetInfo(),
    watchCancelBet(),
    watchBetCanceled(),
    watchCallBet(),
  ]);
}