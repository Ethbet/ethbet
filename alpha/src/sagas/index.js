import {fork} from 'redux-saga/effects'

import errorsSaga from './errorsSaga';
import web3Saga from './web3Saga';
import balanceSaga from './balanceSaga';
import betSaga from './betSaga';
import userSaga from './userSaga';
import leaderboardSaga from './leaderboardSaga';
import fairnessProofSaga from './fairnessProofSaga';

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(web3Saga);
    yield fork(balanceSaga);
    yield fork(betSaga);
    yield fork(userSaga);
    yield fork(leaderboardSaga);
    yield fork(fairnessProofSaga);
    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};