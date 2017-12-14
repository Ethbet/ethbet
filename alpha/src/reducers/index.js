import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';

import web3Reducer from './web3Reducer';
import balanceReducer from './balanceReducer';
import betReducer from './betReducer';
import userReducer from './userReducer';
import leaderboardReducer from './leaderboardReducer';

const rootReducer = combineReducers({
  routing: routerReducer,
  notifications,
  web3Store: web3Reducer,
  balanceStore: balanceReducer,
  betStore: betReducer,
  userStore: userReducer,
  leaderboardStore: leaderboardReducer,
});

export default rootReducer;