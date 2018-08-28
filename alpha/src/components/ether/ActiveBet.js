import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');
let _ = require('lodash');

import * as notificationActions from '../../actions/notificationActions';
import * as etherBetActions from '../../actions/etherBetActions';

class ActiveBet extends Component {

  callBet(betId) {
    let bet = this.props.bet;
    let amount = bet.amount;
    let winChance = 50 - bet.edge/2 ;
    let loseChance = 50 + bet.edge/2;
    const r = confirm(`You are calling a bet of ${amount} ETH with an edge of ${bet.edge}%.
There is a ${winChance}% chance you will win ${amount} ETH
There is a ${loseChance}% chance you will lose ${amount} ETH`);
    if (r === true) {
      this.props.etherBetActions.callBet({ id: betId });
    }
  }

  cancelBet(betId) {
    this.props.etherBetActions.cancelBet({ id: betId })
  }

  render() {
    let { web3Store, etherBetStore, bet } = this.props;

    let userDisplay = bet.username || _.truncate(bet.user, { 'length': 15 });

    return (
      <div className="col-lg-4 active-bet" key={bet.id}>
        <div className="well">
          <div>Amount: {bet.amount} ETH</div>
          <div>Edge: {bet.edge} %</div>
          <div>From: {userDisplay}</div>
          <div>
            {bet.user === web3Store.get("web3").eth.defaultAccount ?
              <button type="button" className="btn btn-danger"
                      onClick={() => this.cancelBet(bet.id)}
                      disabled={etherBetStore.get("cancelingBet") || etherBetStore.get("callingBet")}>
                Cancel
              </button> :
              <button type="button" className="btn btn-info"
                      onClick={() => this.callBet(bet.id)}
                      disabled={etherBetStore.get("cancelingBet") || etherBetStore.get("callingBet")}>
                Call
              </button>
            }
          </div>

          <Loader color="white"
                  loaded={etherBetStore.get("callingBet") !== bet.id && etherBetStore.get("cancelingBet") !== bet.id}/>
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
)(ActiveBet);