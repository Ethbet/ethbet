import {call, put, all, takeEvery, select} from 'redux-saga/effects';

import * as etherLeaderboardActions from '../actions/etherLeaderboardActions';


import etherLeaderboardService from '../utils/etherLeaderboardService';


function* loadLeaderboard(data) {
  yield put(etherLeaderboardActions.fetchLoadLeaderboard.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const leaderboard = yield call(etherLeaderboardService.loadLeaderboard, web3);
    yield put(etherLeaderboardActions.fetchLoadLeaderboard.success({leaderboard}));
  } catch (error) {
    yield put(etherLeaderboardActions.fetchLoadLeaderboard.failure({error}));
  }
}

function* watchLoadLeaderboard() {
  yield takeEvery(etherLeaderboardActions.LOAD_LEADERBOARD, loadLeaderboard);
}


export default function* leaderboardSaga() {
  yield all([
    watchLoadLeaderboard(),
  ]);
}