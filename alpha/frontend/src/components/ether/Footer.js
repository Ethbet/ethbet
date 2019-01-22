import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import _ from 'lodash';

import * as notificationActions from '../../actions/notificationActions';

import EtherLogo from '../../images/ether.png';

class Footer extends Component {

  constructor(props) {
    super(props);

    this.state = {};
  }

  componentDidMount() {

  }

  render() {
    let { etherBalanceStore, etherBetStore } = this.props;

    return (
      <footer className="navbar-default navbar-fixed-bottom home-footer">
        <div className="row">
          <div className="col-lg-2">
          </div>
          <div className="col-lg-3">
            <img className="footer-ebet-logo" src="https://ethbet.io/img/logo.png" alt="Ethbet Logo"/>
            <span>{etherBalanceStore.get("balance") / 100} deposited ({etherBalanceStore.get("walletBalance") / 100} wallet)</span>
          </div>
          <div className="col-lg-3">
            <img className="footer-eth-logo" src={EtherLogo} alt="Ether Logo"/>
            <span>{_.round(etherBalanceStore.get("ethBalance"), 5)} deposited ({_.round(etherBalanceStore.get("lockedEthBalance"), 4)} locked, {_.round(etherBalanceStore.get("walletEthBalance"), 4)} wallet)</span>
          </div>
          <div className="col-lg-3">
            <div className="footer-offered-bets">Offered Bets: <span>
              {_.isNumber(etherBetStore.get("userActiveBetsCount")) ? etherBetStore.get("userActiveBetsCount") : "N/A"}
              </span></div>
          </div>
        </div>
      </footer>
    );
  }

}


const mapStateToProps = (state) => {
  return {
    etherBalanceStore: state.etherBalanceStore,
    etherBetStore: state.etherBetStore,
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
