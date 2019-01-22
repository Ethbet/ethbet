import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import TimeAgo from 'react-timeago'

import * as notificationActions from '../actions/notificationActions';
import * as betActions from '../actions/betActions';

import BetInfoModal from './BetInfoModal';

class ExecutedBet extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isBetInfoModalOpen: false,
    };
  }

  openBetInfoModal() {
    this.setState({ isBetInfoModalOpen: true });
  }

  handleBetInfoModalCloseRequest() {
    this.setState({ isBetInfoModalOpen: false });
  }

  render() {
    let { bet } = this.props;

    let winner = (bet.makerWon ? bet.username : bet.callerUsername) || "Anonymous";
    let loser = (!bet.makerWon ? bet.username : bet.callerUsername) || "Anonymous";

    return (

      <div className="col-lg-12 executed-bet" key={bet.id}>
        <div className="well">
          <div>Amount: {bet.amount / 100} EBET | Edge: {bet.edge} %</div>
          <div>Winner: {winner}</div>
          <div>Loser: {loser}</div>
          <div>Time: <TimeAgo date={bet.executedAt}/></div>
          <a href="##" onClick={() => this.openBetInfoModal()}>
            More Info
          </a>
          <BetInfoModal betId={bet.id}
            modalIsOpen={this.state.isBetInfoModalOpen}
            handleModalCloseRequest={this.handleBetInfoModalCloseRequest.bind(this)}/>
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