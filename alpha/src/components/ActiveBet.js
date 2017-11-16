import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as betActions from '../actions/betActions';


class ActiveBet extends Component {

  callBet(betId) {

  }

  cancelBet(betId) {
    this.props.betActions.cancelBet({id:betId})
  }

  render() {
    let {web3Store, betStore, bet} = this.props;

    return (
      <div className="col-lg-4 active-bet" key={bet.id}>
        <div className="well">
          <div>Amount: {bet.amount / 100} EBET</div>
          <div>Edge : {bet.edge} %</div>
          <div>
            {bet.user === web3Store.get("web3").eth.defaultAccount ?
              <button type="button" className="btn btn-danger"
                      onClick={() => this.cancelBet(bet.id)}
                      disabled={betStore.get("cancelingBet")}>
                Cancel
              </button> :
              <button type="button" className="btn btn-info"
                      onClick={() => this.callBet(bet.id)}
                      disabled={betStore.get("callingBet")}>
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