import React, {Component} from 'react'

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import * as notificationActions from '../actions/notificationActions';

import BetMaker from './BetMaker';
import ActiveBets from "./ActiveBets";

import BetsHistory from "./BetsHistory";
import Balance from './Balance';

import '../css/custom.css';
import '../css/bootstrap.min.css';

class Home extends Component {

  render() {
    if (!this.props.web3Store.get("web3")) {
      return null;
    }

    return (
      <div>
        <div className="container">
          <div className="row front-row">
            <Balance/>
            <BetMaker/>
            <BetsHistory/>
          </div>

          <div className="row">
            <ActiveBets/>
          </div>

        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Home);