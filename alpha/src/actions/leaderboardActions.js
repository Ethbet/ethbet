import {action, createRequestTypes} from '../utils/actionUtils';

export const LOAD_LEADERBOARD = 'LOAD_LEADERBOARD';
export const loadLeaderboard = data => action(LOAD_LEADERBOARD, data);

export const FETCH_LOAD_LEADERBOARD = createRequestTypes('FETCH_LOAD_LEADERBOARD');
export const fetchLoadLeaderboard = {
  request: () => action(FETCH_LOAD_LEADERBOARD.REQUEST),
  success: (data) => action(FETCH_LOAD_LEADERBOARD.SUCCESS, data),
  failure: (error) => action(FETCH_LOAD_LEADERBOARD.FAILURE, error),
};

