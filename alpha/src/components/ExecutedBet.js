import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import TimeAgo from 'react-timeago'

import * as notificationActions from '../actions/notificationActions';
import * as betActions from '../actions/betActions';


class ExecutedBet extends Component {

  render() {
    let {bet} = this.props;

    let winner = bet.makerWon ? bet.user : bet.callerUser;
    let loser = !bet.makerWon ? bet.user : bet.callerUser;

    return (

      <div className="col-lg-12 executed-bet" key={bet.id}>
        <div className="well">
          <div>Amount: {bet.amount / 100} EBET | Edge: {bet.edge} %</div>
          <div>Winner: {winner}</div>
          <div>Loser: {loser}</div>
          <div>Time: <TimeAgo date={bet.executedAt}/></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    betStore: state.betStore,
    web3Store: state.web3Store,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    betActions: bindActionCreators(betActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ExecutedBet);