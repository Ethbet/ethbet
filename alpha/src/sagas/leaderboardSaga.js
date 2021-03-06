import {call, put, all, takeEvery, select} from 'redux-saga/effects';

import * as leaderboardActions from '../actions/leaderboardActions';


import leaderboardService from '../utils/leaderboardService';


function* loadLeaderboard(data) {
  yield put(leaderboardActions.fetchLoadLeaderboard.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const leaderboard = yield call(leaderboardService.loadLeaderboard, web3);
    yield put(leaderboardActions.fetchLoadLeaderboard.success({leaderboard}));
  } catch (error) {
    yield put(leaderboardActions.fetchLoadLeaderboard.failure({error}));
  }
}

function* watchLoadLeaderboard() {
  yield takeEvery(leaderboardActions.LOAD_LEADERBOARD, loadLeaderboard);
}


export default function* leaderboardSaga() {
  yield all([
    watchLoadLeaderboard(),
  ]);
}