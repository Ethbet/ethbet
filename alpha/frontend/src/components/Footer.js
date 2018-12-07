import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import _ from 'lodash';

import * as notificationActions from '../actions/notificationActions';

import EtherLogo from '../images/ether.png';

class Footer extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let { balanceStore, betStore } = this.props;

    return (
      <footer className="navbar-default navbar-fixed-bottom home-footer">
        <div className="row">
          <div className="col-lg-2">
          </div>
          <div className="col-lg-3">
            <img className="footer-ebet-logo" src="https://ethbet.io/img/logo.png" alt="Ethbet Logo"/>
            <span>{balanceStore.get("balance") / 100} deposited ({balanceStore.get("lockedBalance") / 100} locked, {balanceStore.get("walletBalance") / 100} wallet)</span>
          </div>
          <div className="col-lg-3">
            <img className="footer-eth-logo" src={EtherLogo} alt="Ether Logo"/>
            <span>{_.round(balanceStore.get("ethBalance"), 5)} deposited ({_.round(balanceStore.get("walletEthBalance"), 4)} wallet)</span>
          </div>
          <div className="col-lg-3">
            <div className="footer-offered-bets">Offered Bets: <span>{betStore.get("userActiveBetsCount") || "N/A"}</span></div>
          </div>
        </div>
      </footer>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    balanceStore: state.balanceStore,
    betStore: state.betStore,
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
)(Footer);
