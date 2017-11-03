import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import * as notificationActions from '../actions/notificationActions';

class Balance extends Component {

  constructor(props) {
    super(props);

    this.state = {
    };
  }

  componentDidMount() {

  }

  handleChange(event) {
    this.setState({
      [event.target.name]: event.target.value
    });
  }

  render() {

    let {balanceStore} = this.props;

    return (
      <div className="col-lg-4">
        <div className="well">
          <legend>Balance: {balanceStore.get("balance")} EBET</legend>

          <div className="row">
            <div className="col-lg-7">
              <input name="deposit" value={this.state.deposit} onInput={this.handleChange} type="text"
                     className="form-control" placeholder="Deposit tokens"/>
            </div>
            <div className="col-lg-4">
              <button type="button" className="btn btn-info" onClick={this.depositTokens}>Deposit</button>
            </div>
          </div>

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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Balance);
