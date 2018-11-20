import {Map as ImmutableMap} from 'immutable';


let initialData = {
  newUser: {
    username: "",
  },
  savingNewUser: false,
  currentUser: null
};

export default function userReducer(state = new ImmutableMap(initialData), action) {

  const setNewUser = (state) => {
    return state
      .set('newUser', action.newUser);
  };

  const postSaveNewUserRequest = (state) => {
    return state
      .set('savingNewUser', true);
  };

  const postSaveNewUserSuccess = (state) => {
    return state
      .set('savingNewUser', false)
      .set('newUser', initialData.newUser)
      .set('currentUser', action.user);
  };

  const postSaveNewUserFailure = (state) => {
    return state
      .set('savingNewUser', false);
  };

  const fetchLoadCurrentUserRequest = (state) => {
    return state
      .set('loadingCurrentUser', true);
  };

  const fetchLoadCurrentUserSuccess = (state) => {
    return state
      .set('loadingCurrentUser', false)
      .set('currentUser', action.currentUser);
  };

  const fetchLoadCurrentUserFailure = (state) => {
    return state
      .set('loadingCurrentUser', false);
  };
  
  const actions = {
    'SET_NEW_USER': () => setNewUser(state),
    'POST_SAVE_NEW_USER_REQUEST': () => postSaveNewUserRequest(state),
    'POST_SAVE_NEW_USER_SUCCESS': () => postSaveNewUserSuccess(state),
    'POST_SAVE_NEW_USER_FAILURE': () => postSaveNewUserFailure(state),
    'FETCH_LOAD_CURRENT_USER_REQUEST': () => fetchLoadCurrentUserRequest(state),
    'FETCH_LOAD_CURRENT_USER_SUCCESS': () => fetchLoadCurrentUserSuccess(state),
    'FETCH_LOAD_CURRENT_USER_FAILURE': () => fetchLoadCurrentUserFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}