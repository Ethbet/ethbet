import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');
let _ = require('lodash');

import * as notificationActions from '../actions/notificationActions';
import * as betActions from '../actions/betActions';

class ActiveBet extends Component {

  callBet(betId) {
    let bet = this.props.bet;
    let amount = bet.amount/100;
    let winChance = 50 - bet.edge/2 ;
    let loseChance = 50 + bet.edge/2;
    const r = confirm(`You are calling a bet of ${amount} EBET with an edge of ${bet.edge}%.
There is a ${winChance}% chance you will win ${amount} EBET
There is a ${loseChance}% chance you will lose ${amount} EBET`);
    if (r === true) {
      this.props.betActions.callBet({ id: betId });
    }
  }

  cancelBet(betId) {
    this.props.betActions.cancelBet({ id: betId })
  }

  render() {
    let { web3Store, betStore, bet } = this.props;

    let userDisplay = bet.username || _.truncate(bet.user, { 'length': 15 });

    return (
      <div className="col-lg-4 active-bet" key={bet.id}>
        <div className="well">
          <div>Amount: {bet.amount / 100} EBET</div>
          <div>Edge: {bet.edge} %</div>
          <div>From: {userDisplay}</div>
          <div>
            {bet.user === web3Store.get("web3").eth.defaultAccount ?
              <button type="button" className="btn btn-danger"
                      onClick={() => this.cancelBet(bet.id)}
                      disabled={betStore.get("cancelingBet") || betStore.get("callingBet")}>
                Cancel
              </button> :
              <button type="button" className="btn btn-info"
                      onClick={() => this.callBet(bet.id)}
                      disabled={betStore.get("cancelingBet") || betStore.get("callingBet")}>
                Call
              </button>
            }
          </div>

          <Loader color="white"
                  loaded={betStore.get("callingBet") !== bet.id && betStore.get("cancelingBet") !== bet.id}/>
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
)(ActiveBet);