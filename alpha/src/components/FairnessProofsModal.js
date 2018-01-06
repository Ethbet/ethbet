import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as fairnessProofActions from '../actions/fairnessProofActions';

import Modal from 'react-modal';

let _ = require('lodash');
let moment = require('moment');

class FairnessProofs extends Component {

  handleAfterOpen() {
    this.props.fairnessProofActions.loadFairnessProofs();
  }

  render() {
    let {fairnessProofStore} = this.props;
    let fairnessProofs = fairnessProofStore.get("fairnessProofs");

    return (
      <Modal
        className="Modal__Bootstrap modal-dialog fairness-proofs-modal-dialog"
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
            <h4 className="modal-title">Fairness Proofs</h4>
          </div>
          <div className="modal-body">

            {fairnessProofs ?
              <div className="row">
                <div className="col-lg-12">
                  <table className="table table-bordered table-hover table-condensed table-responsive">
                    <thead>
                    <tr>
                      <th>Date</th>
                      <th>Server Seed</th>
                      <th>Server Seed Hash</th>
                    </tr>
                    </thead>
                    <tbody>
                    {fairnessProofs.map((fairnessProof) => (
                      <tr key={fairnessProof.id}>
                        <td>{fairnessProof.date}</td>
                        <td>{fairnessProof.serverSeed || "Hidden"}</td>
                        <td>{fairnessProof.serverSeedHash}</td>
                      </tr>
                    ))}
                    </tbody>
                  </table>
                </div>
              </div>
              : null}

            <div className="row">
              <div className="col-lg-12">
                <Loader color="white" loaded={!fairnessProofStore.get("loadingFairnessProofs")}/>
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
    fairnessProofStore: state.fairnessProofStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    fairnessProofActions: bindActionCreators(fairnessProofActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FairnessProofs);