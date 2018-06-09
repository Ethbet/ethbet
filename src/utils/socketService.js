import io from 'socket.io-client';
import * as betActions from '../actions/betActions';

import configureStore from '../store/configureStore';

let socket, store;

function init() {
  socket = io.connect(process.env.BACKEND_URL , { path: '/api/socket.io'});
  store = configureStore();
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

  // Bet called
  socket.on('betCalled', function (bet) {
    store.dispatch(betActions.betCalled({bet}));
  });
}

let socketService = {
  init: init,
  socket: socket
};

export default socketService;
