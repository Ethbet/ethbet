import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


import * as notificationActions from '../actions/notificationActions';

import Modal from 'react-modal';

class HelpModal extends Component {

  handleAfterOpen() {

  }

  render() {

    return (
      <Modal
        ariaHideApp={false}
        className="Modal__Bootstrap modal-dialog"
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
            <h4 className="modal-title">How to Play</h4>
          </div>
          <div className="modal-body">
            <b>Welcome to the Ethbet Beta.</b>
            <p>
              Ethbet is a platform that allows users to bet directly against each other on their own terms. This beta
              currently supports betting with EBET tokens. If you do not own EBET tokens or would like to learn more
              about them, please visit <a target="_blank" rel="noopener noreferrer" href="https://token.ethbet.io/">https://token.ethbet.io/</a>.
            </p>
            <p>
              In order to play you must have the metamask browser extension and know how to use it. The metamask
              extension works with both Firefox and Chrome and allows you to interact directly with the Ethereum
              blockchain from your browser.
            </p>

            <b>How to Play</b>
            <p>
              Type the amount of EBET you would like to deposit into the Deposit box and then hit Deposit. You will have
              to confirm two transactions with Metamask. After this is completed and confirmed you will have a balance
              of EBET in the contract located at the top left.
            </p>
            <p>
              Now you are free to bet against other users. You can create your own bet or take someone else’s bet,
              referred to as calling it. For example, if you’d like to offer a bet of 100 EBET that has an edge of 5% in
              your favor, input 100 and 5 into the EBET and ‘% Edge’ boxes in the ‘Offer Bet’ section.
            </p>
            <p>
              If you’d like to call someone else’s bet, just hit call on the bet you’d like to take in the Active Bets
              section. A confirmation dialog will be presented to make sure you know exactly what you’re doing.
            </p>
            <p>
              Bets may take up to a few minutes to execute as your transaction must be mined on the Ethereum network.
              When you are done playing you can cancel your bets if you would like to and then withdraw your EBET from
              the smart contract.
            </p>
            <p>
              For more information and community discussion feel free to join our Discord:&nbsp;
              <a target="_blank"  rel="noopener noreferrer" href="https://discord.gg/V4W94mW">https://discord.gg/V4W94mW</a>
            </p>
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
  return {};
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(HelpModal);