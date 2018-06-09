import {call, take} from 'redux-saga/effects';

export function* takexSaga(pattern) {
  let action;
  while (true) {
    action = yield take('*');
    if (pattern.test(action.type)) {
      break;
    }
  }
  return action;
}

export function takex(pattern) {
  return call(takexSaga, pattern);
}

export default function* errorsSaga() {
  while (true) {
    const action = yield takex(/_FAILURE$/);
    console.log('handle', action.type);
    console.log('error', action.error);
  }
}