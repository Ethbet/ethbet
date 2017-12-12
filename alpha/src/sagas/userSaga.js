import {call, put, all, takeEvery, select} from 'redux-saga/effects';

const _ = require('lodash');

import * as userActions from '../actions/userActions';
import * as web3Actions from '../actions/web3Actions';
import * as notificationActions from '../actions/notificationActions';

import userService from '../utils/userService';

function* loadInitialData(data) {
  yield all([
    put(userActions.loadCurrentUser()),
  ])
}


function* loadCurrentUser(data) {
  yield put(userActions.fetchLoadCurrentUser.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const currentUser = yield call(userService.loadCurrentUser, web3);
    yield put(userActions.fetchLoadCurrentUser.success({currentUser}));
  } catch (error) {
    yield put(userActions.fetchLoadCurrentUser.failure({error}));
  }
}

function* saveNewUser(data) {
  yield put(userActions.postSaveNewUser.request());
  try {
    const web3 = yield select(state => state.web3Store.get("web3"));
    const newUser = yield select(state => state.userStore.get("newUser"));

    const user = yield call(userService.createUser, web3, newUser);

    yield put(userActions.postSaveNewUser.success({user}));

    yield put(notificationActions.success({
      notification: {
        title: 'username saved successfully',
        position: 'br'
      }
    }));
  } catch (error) {
    yield put(userActions.postSaveNewUser.failure({error}));
    yield put(notificationActions.error({
      notification: {
        title: 'failed to save username',
        // handle axios error format if available
        message: _.get(error, 'response.data.message') || error.message,
        position: 'br'
      }
    }));
  }
}


function* watchSetupWeb3Success() {
  yield takeEvery(web3Actions.SETUP_WEB3.SUCCESS, loadInitialData);
}

function* watchLoadCurrentUser() {
  yield takeEvery(userActions.LOAD_CURRENT_USER, loadCurrentUser);
}

function* watchSaveNewUser() {
  yield takeEvery(userActions.SAVE_NEW_USER, saveNewUser);
}


export default function* userSaga() {
  yield all([
    watchSetupWeb3Success(),
    watchLoadCurrentUser(),
    watchSaveNewUser(),
  ]);
}