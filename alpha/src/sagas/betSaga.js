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

    const results = yield call(betService.makeBet, web3, newBet);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(betActions.postSaveNewBet.success({results}));

    console.log("saveNewBet TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'new bet saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(betActions.postSaveNewBet.failure({error}));
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
  yield put(betActions.fetchGetActiveBets.request());
  try {
    const activeBets = yield call(betService.getActiveBets);
    yield put(betActions.fetchGetActiveBets.success({activeBets}));
  } catch (error) {
    yield put(betActions.fetchGetActiveBets.failure({error}));
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
    yield put(betActions.fetchGetExecutedBets.success({executedBets}));
  } catch (error) {
    yield put(betActions.fetchGetExecutedBets.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to get executed bets',
        message: error.message,
        position: 'br'
      }
    }));
  }
}

function* cancelBet(data) {
  yield put(betActions.postCancelBet.request({betId: data.id}));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(betService.cancelBet, web3, data.id);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(betActions.postCancelBet.success({results}));

    console.log("cancelBet TX", results.tx);
    yield put(notificationActions.success({
      notification: {
        title: 'bet canceled successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(betActions.postCancelBet.failure({error}));
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
  yield put(betActions.postCallBet.request({betId: data.id}));
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));

    const results = yield call(betService.callBet, web3, data.id);

    // delay to allow changes to be committed to local node
    yield delay(1000);

    yield put(betActions.postCallBet.success({results}));

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
    yield put(betActions.postCallBet.failure({error}));
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

function* watchGetActiveBets() {
  yield takeEvery(betActions.GET_ACTIVE_BETS, getActiveBets);
}

function* watchGetExecutedBets() {
  yield takeEvery(betActions.GET_EXECUTED_BETS, getExecutedBets);
}

function* watchCancelBet() {
  yield takeEvery(betActions.CANCEL_BET, cancelBet);
}

function* watchCallBet() {
  yield takeEvery(betActions.CALL_BET, callBet);
}

function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadInitialData);
}

export default function* betSaga() {
  yield all([
    watchSetupWeb3Success(),
    watchSaveNewBet(),
    watchGetActiveBets(),
    watchGetExecutedBets(),
    watchCancelBet(),
    watchCallBet(),
  ]);
}