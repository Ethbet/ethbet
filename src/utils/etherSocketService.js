import io from 'socket.io-client';
import * as etherBetActions from '../actions/etherBetActions';

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
  socket.on('etherBetCreated', function (bet) {
    store.dispatch(etherBetActions.betCreated({bet}));
  });

  // Bet canceled
  socket.on('etherBetCanceled', function (bet) {
    store.dispatch(etherBetActions.betCanceled({bet}));
  });

  // Bet called
  socket.on('etherBetCalled', function (bet) {
    store.dispatch(etherBetActions.betCalled({bet}));
  });

  // Bet executed
  socket.on('etherBetExecuted', function (bet) {
    store.dispatch(etherBetActions.betExecuted({bet}));
  });
}

let etherSocketService = {
  init: init,
  socket: socket
};

export default etherSocketService;
