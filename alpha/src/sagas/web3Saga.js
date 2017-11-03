import {call, put, all, takeEvery} from 'redux-saga/effects';

import * as web3Actions from '../actions/web3Actions';

import web3Service from '../utils/web3Service';


function* initWeb3(data) {
  yield put(web3Actions.setupWeb3.request());
  try {
    const {web3, networkName} = yield call(web3Service.getWeb3);
    yield put(web3Actions.setupWeb3.success({web3, networkName}));
  } catch (error) {
    yield put(web3Actions.setupWeb3.failure({error}));
  }
}

function* watchInitWeb3() {
  yield takeEvery(web3Actions.INIT_WEB3, initWeb3);
}


export default function* web3Saga() {
  yield all([
    watchInitWeb3()
  ]);
}