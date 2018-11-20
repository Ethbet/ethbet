import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import TimeAgo from 'react-timeago'

import * as notificationActions from '../../actions/notificationActions';
import * as etherBetActions from '../../actions/etherBetActions';

class PendingBet extends Component {

  render() {
    let { bet } = this.props;

    let maker = bet.username || "Anonymous";
    let caller = bet.callerUsername || "Anonymous";

    return (

      <div className="col-lg-12 pending-bet" key={bet.id}>
        <div className="well">
          <div>Amount: {bet.amount} ETH | Edge: {bet.edge} %</div>
          <div>Maker: {maker}</div>
          <div>Caller: {caller}</div>
          <div>Initialized At: <TimeAgo date={bet.initializedAt}/></div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    etherBetStore: state.etherBetStore,
    web3Store: state.web3Store,
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
)(PendingBet);