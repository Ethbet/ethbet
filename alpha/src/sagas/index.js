import errorsSaga from './errorsSaga';
import {fork} from 'redux-saga/effects'

export const runSagas = (sagaMiddleware) => {
  function* rootSaga() {
    yield fork(errorsSaga);
  }

  sagaMiddleware.run(rootSaga);
};