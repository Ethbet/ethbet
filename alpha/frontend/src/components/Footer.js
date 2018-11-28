import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import _ from 'lodash';

import * as notificationActions from '../actions/notificationActions';
import * as balanceActions from '../actions/balanceActions';

import EtherLogo from '../images/ether.png';

class Footer extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let { balanceStore } = this.props;

    return (
      <footer className="navbar-default navbar-fixed-bottom home-footer">
        <div className="row">
          <div className="col-lg-3">
          </div>
          <div className="col-lg-3">
            <img className="footer-ebet-logo" src="https://ethbet.io/img/logo.png" alt="Ethbet Logo"/>
            <span>{balanceStore.get("balance") / 100} ({balanceStore.get("lockedBalance") / 100} Locked| {balanceStore.get("walletBalance") / 100} Wallet)</span>
          </div>
          <div className="col-lg-3">
            <img className="footer-eth-logo" src={EtherLogo} alt="Ether Logo"/>
            <span>{_.round(balanceStore.get("ethBalance"), 5)} ({_.round(balanceStore.get("walletEthBalance"), 4)} Wallet)</span>
          </div>
        </div>
      </footer>
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
)(Footer);
