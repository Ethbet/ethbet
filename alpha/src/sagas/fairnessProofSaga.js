import {call, put, all, takeEvery, select} from 'redux-saga/effects';

import * as fairnessProofActions from '../actions/fairnessProofActions';

import fairnessProofService from '../utils/fairnessProofService';

function* loadFairnessProofs(data) {
  yield put(fairnessProofActions.fetchLoadFairnessProofs.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const fairnessProofs = yield call(fairnessProofService.loadFairnessProofs, web3);
    yield put(fairnessProofActions.fetchLoadFairnessProofs.success({fairnessProofs}));
  } catch (error) {
    yield put(fairnessProofActions.fetchLoadFairnessProofs.failure({error}));
  }
}

function* watchLoadFairnessProofs() {
  yield takeEvery(fairnessProofActions.LOAD_FAIRNESS_PROOFS, loadFairnessProofs);
}


export default function* fairnessProofSaga() {
  yield all([
    watchLoadFairnessProofs(),
  ]);
}