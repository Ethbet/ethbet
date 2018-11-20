import {Map as ImmutableMap} from 'immutable';


let initialData = {
  leaderboard: 0,
  loadingLeaderboard: false
};

export default function leaderboardReducer(state = new ImmutableMap(initialData), action) {

  const fetchLoadLeaderboardRequest = (state) => {
    return state
      .set('loadingLeaderboard', true);
  };

  const fetchLoadLeaderboardSuccess = (state) => {
    return state
      .set('loadingLeaderboard', false)
      .set('leaderboard', action.leaderboard)
  };

  const fetchLoadLeaderboardFailure = (state) => {
    return state
      .set('loadingLeaderboard', false);
  };

  const actions = {
    'FETCH_LOAD_LEADERBOARD_REQUEST': () => fetchLoadLeaderboardRequest(state),
    'FETCH_LOAD_LEADERBOARD_SUCCESS': () => fetchLoadLeaderboardSuccess(state),
    'FETCH_LOAD_LEADERBOARD_FAILURE': () => fetchLoadLeaderboardFailure(state),
    'DEFAULT': () => state
  };

  return ((action && actions[action.type]) ? actions[action.type] : actions['DEFAULT'])()
}