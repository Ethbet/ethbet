import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Loader from 'react-loader';

import * as betActions from '../actions/betActions';

import Modal from 'react-modal';

class BetInfoModal extends Component {

  handleAfterOpen() {
    this.props.betActions.getBetInfo({ id: this.props.betId });
  }

  render() {
    let { betStore } = this.props;
    let gettingBetInfo = betStore.get("gettingBetInfo");
    let bet = betStore.get("betsInfo")[this.props.betId];

    let makerDisplay;
    let callerDisplay;

    if (bet) {
      makerDisplay = `${bet.username || "Anonymous"} (${bet.user})`;
      callerDisplay = `${bet.callerUsername || "Anonymous"} (${bet.callerUser})`;
    }

    return (
      <Modal
        ariaHideApp={false}
        className="Modal__Bootstrap modal-dialog bet-info-modal-dialog"
        closeTimeoutMS={150}
        isOpen={this.props.modalIsOpen}
        onAfterOpen={this.handleAfterOpen.bind(this)}
        onRequestClose={this.props.handleModalCloseRequest}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.props.handleModalCloseRequest}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Bet Info</h4>
          </div>
          <div className="modal-body">

            {bet ?
              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-bordered table-hover table-condensed table-responsive">
                    <tbody>
                    <tr>
                      <th>Bet Id</th>
                      <td>{bet.id}</td>
                    </tr>
                    <tr>
                      <th>Maker ({bet.makerWon ? "WON" : "LOST"})</th>
                      <td>{makerDisplay}</td>
                    </tr>
                    <tr>
                      <th>Caller ({bet.makerWon ? "LOST" : "WON"})</th>
                      <td>{callerDisplay}</td>
                    </tr>
                    <tr>
                      <th>Amount</th>
                      <td>{bet.amount / 100} EBET</td>
                    </tr>
                    <tr>
                      <th>Edge</th>
                      <td>{bet.edge}</td>
                    </tr>
                    <tr>
                      <th>Roll</th>
                      <td>{bet.roll}</td>
                    </tr>
                    <tr>
                      <th>Maker Seed</th>
                      <td>{bet.seed}</td>
                    </tr>
                    <tr>
                      <th>Caller Seed</th>
                      <td>{bet.callerSeed}</td>
                    </tr>
                    <tr>
                      <th>Server Seed</th>
                      <td>{bet.serverSeed || "Hidden"}</td>
                    </tr>
                    <tr>
                      <th>Full Seed</th>
                      <td>{bet.serverSeed ? bet.seed + bet.callerSeed + bet.serverSeed + bet.id : "Hidden"}</td>
                    </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              : null}

            <div className="row">
              <div className="col-lg-12">
                <Loader color="white" loaded={gettingBetInfo !== this.props.betId}/>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={this.props.handleModalCloseRequest}>Close
            </button>
          </div>
        </div>
      </Modal>
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
    betActions: bindActionCreators(betActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BetInfoModal);