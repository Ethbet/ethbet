import {combineReducers} from 'redux';
import {routerReducer} from 'react-router-redux';
import {reducer as notifications} from 'react-notification-system-redux';

import web3Reducer from './web3Reducer';
import userReducer from './userReducer';

import balanceReducer from './balanceReducer';
import betReducer from './betReducer';
import leaderboardReducer from './leaderboardReducer';
import fairnessProofReducer from './fairnessProofReducer';

import etherBalanceReducer from './etherBalanceReducer';
import etherBetReducer from './etherBetReducer';


const rootReducer = combineReducers({
  routing: routerReducer,
  notifications,
  web3Store: web3Reducer,
  userStore: userReducer,

  // EBET Stores
  balanceStore: balanceReducer,
  betStore: betReducer,
  leaderboardStore: leaderboardReducer,
  fairnessProofStore: fairnessProofReducer,

  // ETH Stores
  etherBalanceStore: etherBalanceReducer,
  etherBetStore: etherBetReducer,


});

export default rootReducer;