import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../../actions/notificationActions';
import * as etherBetActions from '../../actions/etherBetActions';

import ExecutedBet from "./ExecutedBet";

class BetsHistory extends Component {

  render() {
    let {etherBetStore} = this.props;

    return (
      <div className="col-lg-12">
        <div className="well">
          <legend>Executed Bets</legend>

          <div className="row">
            {etherBetStore.get("executedBets").map((bet) => (
              <ExecutedBet bet={bet} key={bet.id}/>
            ))}
          </div>

          <Loader color="white" loaded={!etherBetStore.get("gettingExecutedBets")}/>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    etherBetStore: state.etherBetStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    etherBetActions: bindActionCreators(etherBetActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BetsHistory);