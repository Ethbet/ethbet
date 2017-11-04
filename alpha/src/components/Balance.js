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

  render() {
    let {balanceStore} = this.props;

    return (
      <div className="col-lg-4">
        <div className="well">
          <legend>Balance: {balanceStore.get("balance") / 100} EBET</legend>

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
              <input name="withdraw" value={this.state.withdraw} onInput={this.handleChange} type="text"
                     className="form-control" placeholder="Withdraw tokens"/>
            </div>
            <div className="col-lg-4">
              <button type="button" className="btn btn-info" onClick={this.withdrawTokens}>Withdraw</button>
            </div>
          </div>

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
