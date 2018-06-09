import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as userActions from '../actions/userActions';

import Modal from 'react-modal';

let _ = require('lodash');

class UsernameModal extends Component {

  handleSaveClicked() {
    this.props.userActions.saveNewUser();
    this.props.handleModalCloseRequest();
  }

  updateNewUser(e) {
    this.props.userActions.setNewUser({newUser: {username: e.target.value}});
  }

  isValidNewUser() {
    let newUserUsername = this.props.userStore.get("newUser").username;
    let newUserUsernameLength = _.trim(newUserUsername).length;
    return newUserUsernameLength > 0 && newUserUsernameLength <= 16;
  }

  render() {
    let {userStore} = this.props;

    return (
      <Modal
        ariaHideApp={false}
        className="Modal__Bootstrap modal-dialog"
        closeTimeoutMS={150}
        isOpen={this.props.modalIsOpen}
        onRequestClose={this.props.handleModalCloseRequest}>
        <div className="modal-content">
          <div className="modal-header">
            <button type="button" className="close" onClick={this.props.handleModalCloseRequest}>
              <span aria-hidden="true">&times;</span>
              <span className="sr-only">Close</span>
            </button>
            <h4 className="modal-title">Username</h4>
          </div>
          <div className="modal-body">
            <input name="withdrawal" type="text"
                   value={userStore.get("newUser").username}
                   onChange={(e) => this.updateNewUser(e)}
                   className="form-control" placeholder="Username"/>
            <div className="row">
              <div className="col-lg-12">
                <Loader color="white" loaded={!userStore.get("savingNewUser")}/>
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn btn-default" onClick={this.props.handleModalCloseRequest}>Close
            </button>
            <button type="button" className="btn btn-primary" onClick={this.handleSaveClicked.bind(this)}
                    disabled={!this.isValidNewUser() || userStore.get("savingNewUser")}>
              Save
            </button>
          </div>
        </div>
      </Modal>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    userStore: state.userStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(UsernameModal);