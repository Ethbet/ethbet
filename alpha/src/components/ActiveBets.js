import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as betActions from '../actions/betActions';

import ActiveBet from "./ActiveBet";


class ActiveBets extends Component {


  render() {
    let {betStore} = this.props;

    return (
      <div className="col-lg-8">
        <div className="well">
          <legend>Active Bets</legend>

          <div className="row">
            {betStore.get("activeBets").map((bet) => (
              <ActiveBet bet={bet}  key={bet.id}/>
            ))}
          </div>

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