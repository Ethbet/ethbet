import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'


import * as notificationActions from '../actions/notificationActions';

import Modal from 'react-modal';

let _ = require('lodash');

class HelpModal extends Component {

  handleAfterOpen(){

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
            <h4 className="modal-title">Help</h4>
          </div>
          <div className="modal-body">
            <p>Work in progress ....</p>
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
  };
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