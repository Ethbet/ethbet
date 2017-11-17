import React from 'react'
import ReactDOM from 'react-dom'
import {Provider} from 'react-redux';
import configureStore from './store/configureStore';
import {Router, Route} from 'react-router-dom'

import Home from './components/Home';
import Navbar from './components/Navbar';
import history from './history'
import socketService from './utils/socketService';

const store = configureStore();

socketService.init();


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Navbar/>
        <Route exact path="/" component={Home}/>
      </div>
    </Router>
  </Provider>
  ,
  document.getElementById('root')
);
