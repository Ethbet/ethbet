import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Loader from 'react-loader';

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
    this.props.balanceActions.setNewDepositValue({ newDepositValue: e.target.value });
  }

  isValidNewDeposit() {
    let newDepositValue = parseFloat(this.props.balanceStore.get("newDepositValue"));
    return newDepositValue > 0;
  }

  saveNewDeposit() {
    this.props.balanceActions.saveNewDeposit();
  }

  updateNewWithdrawalValue(e) {
    this.props.balanceActions.setNewWithdrawalValue({ newWithdrawalValue: e.target.value });
  }

  isValidNewWithdrawal() {
    let newWithdrawalValue = parseFloat(this.props.balanceStore.get("newWithdrawalValue"));
    return newWithdrawalValue > 0;
  }

  saveNewWithdrawal() {
    this.props.balanceActions.saveNewWithdrawal();
  }

  updateNewEthDepositValue(e) {
    this.props.balanceActions.setNewEthDepositValue({ newEthDepositValue: e.target.value });
  }

  isValidNewEthDeposit() {
    let newEthDepositValue = parseFloat(this.props.balanceStore.get("newEthDepositValue"));
    return newEthDepositValue > 0;
  }

  saveNewEthDeposit() {
    this.props.balanceActions.saveNewEthDeposit();
  }

  updateNewEthWithdrawalValue(e) {
    this.props.balanceActions.setNewEthWithdrawalValue({ newEthWithdrawalValue: e.target.value });
  }

  isValidNewEthWithdrawal() {
    let newEthWithdrawalValue = parseFloat(this.props.balanceStore.get("newEthWithdrawalValue"));
    return newEthWithdrawalValue > 0;
  }

  saveNewEthWithdrawal() {
    this.props.balanceActions.saveNewEthWithdrawal();
  }

  render() {
    let { balanceStore } = this.props;

    return (
      <div className="col-lg-7">
        <div className="well">
          <div className="row">
            <div className="col-lg-6">
              <legend>EBET</legend>

            </div>
            <div className="col-lg-6">
              <legend>ETH</legend>

            </div>
          </div>


          <div className="row">
            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-6">
                  <input name="deposit" type="text"
                         value={balanceStore.get("newDepositValue")}
                         onChange={(e) => this.updateNewDepositValue(e)}
                         className="form-control" />
                </div>
                <div className="col-lg-6">
                  <button type="button" className="btn btn-info" onClick={this.saveNewDeposit.bind(this)}
                          disabled={!this.isValidNewDeposit() || balanceStore.get("savingNewDeposit")}>
                    Deposit
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <Loader color="white" loaded={!balanceStore.get("savingNewDeposit")}/>
                </div>
              </div>

              <hr/>

              <div className="row">
                <div className="col-lg-6">
                  <input name="withdrawal" type="text"
                         value={balanceStore.get("newWithdrawalValue")}
                         onChange={(e) => this.updateNewWithdrawalValue(e)}
                         className="form-control" />
                </div>
                <div className="col-lg-6">
                  <button type="button" className="btn btn-info" onClick={this.saveNewWithdrawal.bind(this)}
                          disabled={!this.isValidNewWithdrawal() || balanceStore.get("savingNewWithdrawal")}>
                    Withdraw
                  </button>
                </div>
              </div>
              <Loader color="white" loaded={!balanceStore.get("savingNewWithdrawal")}/>
            </div>

            <div className="col-lg-6">
              <div className="row">
                <div className="col-lg-6">
                  <input name="ethDeposit" type="text"
                         value={balanceStore.get("newEthDepositValue")}
                         onChange={(e) => this.updateNewEthDepositValue(e)}
                         className="form-control" />
                </div>
                <div className="col-lg-6">
                  <button type="button" className="btn btn-info" onClick={this.saveNewEthDeposit.bind(this)}
                          disabled={!this.isValidNewEthDeposit() || balanceStore.get("savingNewEthDeposit")}>
                    Deposit
                  </button>
                </div>
              </div>

              <div className="row">
                <div className="col-lg-12">
                  <Loader color="white" loaded={!balanceStore.get("savingNewEthDeposit")}/>
                </div>
              </div>

              <hr/>

              <div className="row">
                <div className="col-lg-6">
                  <input name="ethWithdrawal" type="text"
                         value={balanceStore.get("newEthWithdrawalValue")}
                         onChange={(e) => this.updateNewEthWithdrawalValue(e)}
                         className="form-control" />
                </div>
                <div className="col-lg-6">
                  <button type="button" className="btn btn-info" onClick={this.saveNewEthWithdrawal.bind(this)}
                          disabled={!this.isValidNewEthWithdrawal() || balanceStore.get("savingNewEthWithdrawal")}>
                    Withdraw
                  </button>
                </div>
              </div>
              <Loader color="white" loaded={!balanceStore.get("savingNewEthWithdrawal")}/>
            </div>
            
          </div>

          <br/>
          <br/>

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
