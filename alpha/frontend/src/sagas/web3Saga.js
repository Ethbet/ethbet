import {call, put, all, takeEvery,select} from 'redux-saga/effects';

import * as web3Actions from '../actions/web3Actions';

import web3Service from '../utils/web3Service';

import logWatchService from '../utils/logWatchService';
import etherLogWatchService from '../utils/etherLogWatchService';

import socketService from '../utils/socketService';
import etherSocketService from '../utils/etherSocketService';


function* initWeb3(data) {
  yield put(web3Actions.setupWeb3.request());
  try {
    const {web3, networkName} = yield call(web3Service.getWeb3);
    yield put(web3Actions.setupWeb3.success({web3, networkName}));
    
    if(data.appType === "EBET"){
      yield put(web3Actions.ebetLoadInitialData());
    }
    else{
      yield put(web3Actions.etherLoadInitialData());
    }
  
  } catch (error) {
    yield put(web3Actions.setupWeb3.failure({error}));
  }
}

function* startEbetLogWatch(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  yield call(logWatchService.start, web3);
}

function* initEbetSocket(data) {
  yield call(socketService.init);
}

function* startEtherLogWatch(data) {
  const web3 = yield select(state => state.web3Store.get("web3"));
  yield call(etherLogWatchService.start, web3);
}

function* initEtherSocket(data) {
  yield call(etherSocketService.init);
}

function* watchInitWeb3() {
  yield takeEvery(web3Actions.INIT_WEB3, initWeb3);
}

function* watchEbetLoadInitialData() {
  yield takeEvery(web3Actions.EBET_LOAD_INITIAL_DATA, startEbetLogWatch);
  yield takeEvery(web3Actions.EBET_LOAD_INITIAL_DATA, initEbetSocket);
}

function* watchEtherLoadInitialData() {
  yield takeEvery(web3Actions.ETHER_LOAD_INITIAL_DATA, startEtherLogWatch);
  yield takeEvery(web3Actions.ETHER_LOAD_INITIAL_DATA, initEtherSocket);
}

export default function* web3Saga() {
  yield all([
    watchInitWeb3(),
    watchEbetLoadInitialData(),
    watchEtherLoadInitialData(),
  ]);
}