import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as leaderboardActions from '../actions/leaderboardActions';

import Modal from 'react-modal';

let _ = require('lodash');

class LeaderboardModal extends Component {

  handleAfterOpen(){
    this.props.leaderboardActions.loadLeaderboard();
  }

  render() {
    let {leaderboardStore} = this.props;
    let leaderboard = leaderboardStore.get("leaderboard");

    return (
      <Modal
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
            <h4 className="modal-title">Leaderboard</h4>
          </div>
          <div className="modal-body">

            {leaderboard ?
              <table className="table table-bordered table-hover table-condensed">
                <thead>
                <tr>
                  <th>Rank</th>
                  <th>Username</th>
                  <th>Profit (EBET)</th>
                </tr>
                </thead>
                <tbody>
                {leaderboard.map((row, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{row.username || "Anonymous"}</td>
                    <td>{row.amount / 100}</td>
                  </tr>
                ))}
                </tbody>
              </table>
              : null}

            <div className="row">
              <div className="col-lg-12">
                <Loader color="white" loaded={!leaderboardStore.get("loadingLeaderboard")}/>
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
    leaderboardStore: state.leaderboardStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    leaderboardActions: bindActionCreators(leaderboardActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LeaderboardModal);