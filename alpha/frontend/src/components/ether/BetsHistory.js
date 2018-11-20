import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Loader from 'react-loader';
import _ from 'lodash';

import * as notificationActions from '../../actions/notificationActions';
import * as etherBetActions from '../../actions/etherBetActions';

import ExecutedBet from "./ExecutedBet";
import PendingBet from "./PendingBet";

class BetsHistory extends Component {

  render() {
    let { etherBetStore } = this.props;

    let pendingBets = etherBetStore.get("pendingBets");

    return (
      <div className="col-lg-12">

        {_.isEmpty(pendingBets) ?
          null
          :
          <div className="well">
            <legend>Pending Bets</legend>

            <div className="row">
              {pendingBets.map((bet) => (
                <PendingBet bet={bet} key={bet.id}/>
              ))}
            </div>

            <Loader color="white" loaded={!etherBetStore.get("gettingPendingBets")}/>
          </div>
        }

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