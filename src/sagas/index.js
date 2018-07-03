import {fork} from 'redux-saga/effects'

import errorsSaga from './errorsSaga';
import web3Saga from './web3Saga';
import userSaga from './userSaga';

import balanceSaga from './balanceSaga';
import betSaga from './betSaga';
import leaderboardSaga from './leaderboardSaga';
import fairnessProofSaga from './fairnessProofSaga';

import etherBalanceSaga from './etherBalanceSaga';

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(web3Saga);
    yield fork(userSaga);

    // EBET Sagas
    yield fork(balanceSaga);
    yield fork(betSaga);
    yield fork(leaderboardSaga);
    yield fork(fairnessProofSaga);

    // ETHER Sagas
    yield fork(etherBalanceSaga);

    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};