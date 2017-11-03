import {createStore, applyMiddleware} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {routerMiddleware} from 'react-router-redux'
import history from '../history'

import rootReducer from '../reducers';
import {runSagas} from '../sagas/index';

const sagaMiddleware = createSagaMiddleware();
const routingMiddleware = routerMiddleware(history);

const configureStore = () => {
  const store = createStore(
    rootReducer,
    applyMiddleware(sagaMiddleware),
    applyMiddleware(routingMiddleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );
  runSagas(sagaMiddleware);
  return store;
};

export default configureStore;