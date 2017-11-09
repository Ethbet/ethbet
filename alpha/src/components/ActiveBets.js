import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as betActions from '../actions/betActions';


class ActiveBets extends Component {

  render() {
    let {betStore} = this.props;

    return (
      <div className="col-lg-4">
        <div className="well">
          <legend>Active Bets</legend>
          <ul>
            {betStore.get("activeBets").map((bet) => (
              <li key={bet.id}>
                <span>Amount: {bet.amount / 100} / Edge : {bet.edge} %  </span>
              </li>
            ))}
          </ul>
          <Loader color="white" loaded={!betStore.get("gettingActiveBets")}/>

        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    betStore: state.betStore,
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
)(ActiveBets);