import {call, put, all, takeEvery, select} from 'redux-saga/effects';
import {delay} from 'redux-saga'

import * as betActions from '../actions/betActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import betService from '../utils/betService';

function* loadInitialData(data) {
  yield put(betActions.getActiveBets());
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
        message: error.message,
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


function* watchSaveNewBet() {
  yield takeEvery(betActions.SAVE_NEW_BET, saveNewBet);
}

function* watchGetActiveBets() {
  yield takeEvery(betActions.GET_ACTIVE_BETS, getActiveBets);
}

function* watchPostSaveNewBetSuccess() {
  //TODO: remove this once sockets are implemented


  yield takeEvery(betActions.POST_SAVE_NEW_BET.SUCCESS, getActiveBets);
}

function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadInitialData);
}

export default function* betSaga() {
  yield all([
    watchSetupWeb3Success(),
    watchSaveNewBet(),
    watchGetActiveBets(),
    watchPostSaveNewBetSuccess(),
  ]);
}