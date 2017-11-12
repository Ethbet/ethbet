import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

let Loader = require('react-loader');

import * as notificationActions from '../actions/notificationActions';
import * as balanceActions from '../actions/balanceActions';


class Balance extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  updateNewDepositValue(e) {
    this.props.balanceActions.setNewDepositValue({newDepositValue: e.target.value});
  }

  isValidNewDeposit() {
    let newDepositValue = parseFloat(this.props.balanceStore.get("newDepositValue"));
    return newDepositValue > 0;
  }

  saveNewDeposit() {
    this.props.balanceActions.saveNewDeposit();
  }

  updateNewWithdrawalValue(e) {
    this.props.balanceActions.setNewWithdrawalValue({newWithdrawalValue: e.target.value});
  }

  isValidNewWithdrawal() {
    let newWithdrawalValue = parseFloat(this.props.balanceStore.get("newWithdrawalValue"));
    return newWithdrawalValue > 0;
  }

  saveNewWithdrawal() {
    this.props.balanceActions.saveNewWithdrawal();
  }

  render() {
    let {balanceStore} = this.props;

    return (
      <div className="col-lg-4">
        <div className="well">
          <legend>Balance: {balanceStore.get("balance") / 100} EBET</legend>

          <ul>
            <li>Locked Balance: {balanceStore.get("lockedBalance") / 100} EBET</li>
            <li>Wallet Balance: {balanceStore.get("walletBalance") / 100} EBET</li>
          </ul>

          <div className="row">
            <div className="col-lg-7">
              <input name="deposit" type="text"
                     value={balanceStore.get("newDepositValue")}
                     onChange={(e) => this.updateNewDepositValue(e)}
                     className="form-control" placeholder="Deposit tokens"/>
            </div>
            <div className="col-lg-4">
                <button type="button" className="btn btn-info" onClick={this.saveNewDeposit.bind(this)}
                        disabled={!this.isValidNewDeposit() || balanceStore.get("savingNewDeposit")}>
                  Deposit
                </button>
            </div>
          </div>
          <Loader color="white" loaded={!balanceStore.get("savingNewDeposit")}/>

          <hr/>

          <div className="row">
            <div className="col-lg-7">
              <input name="withdrawal" type="text"
                     value={balanceStore.get("newWithdrawalValue")}
                     onChange={(e) => this.updateNewWithdrawalValue(e)}
                     className="form-control" placeholder="Withdraw tokens"/>
            </div>
            <div className="col-lg-4">
              <button type="button" className="btn btn-info" onClick={this.saveNewWithdrawal.bind(this)}
                      disabled={!this.isValidNewWithdrawal() || balanceStore.get("savingNewWithdrawal")}>
                Withdraw
              </button>
            </div>
          </div>
          <Loader color="white" loaded={!balanceStore.get("savingNewWithdrawal")}/>

        </div>
      </div>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    balanceStore: state.balanceStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    balanceActions: bindActionCreators(balanceActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Balance);
