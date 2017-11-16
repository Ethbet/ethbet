import io from 'socket.io-client';
import {apiRoot} from './apiService';
import * as betActions from '../actions/betActions';

let socket, store;

function init(_store) {
  socket = io.connect(apiRoot);
  store = _store;
  startListeners();
}

function startListeners() {
  // Socket connect
  socket.on('connect', function () {
    console.log("Socket.io connected ...");
  });

  // Socket disconnect
  socket.on('disconnect', function () {
    console.log("Socket.io disconnected ...");
  });

  // New bet created
  socket.on('betCreated', function (bet) {
    store.dispatch(betActions.betCreated({bet}));
  });

  // Bet canceled
  socket.on('betCanceled', function (bet) {
    store.dispatch(betActions.betCanceled({bet}));
  });
}

let socketService = {
  init: init,
  socket: socket
};

export default socketService;
