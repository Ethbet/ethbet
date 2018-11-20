import React, {Component} from 'react'
import _ from 'lodash';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import * as notificationActions from '../../actions/notificationActions';

import Navbar from './Navbar';

import BetMaker from './BetMaker';
import ActiveBets from "./ActiveBets";

import BetsHistory from "./BetsHistory";
import Balance from './Balance';


class Home extends Component {

  render() {
    let { web3Store } = this.props;

    let web3 = web3Store.get("web3");
    let loadingWeb3 = web3Store.get("loadingWeb3");
    let ownAddress = _.get(web3, 'eth.defaultAccount');

    return (
      <div>
        <Navbar/>

        <div className="container-fluid">
          {loadingWeb3 ? "Loading web3 ..." :
            web3 && ownAddress ?
              <div className="row">
                <div className="col-lg-8">
                  <div className="row">
                    <Balance/>
                    <BetMaker/>
                  </div>
                  <div className="row">
                    <ActiveBets/>
                  </div>
                </div>
                <div className="col-lg-4">
                  <BetsHistory/>
                </div>
              </div>
              :
              <div className="well well-sm">
                <h3>Please enable web3</h3>
                <p>You need <a href="https://metamask.io/">Metamask</a> in order to use Ethbet</p>
              </div>
          }
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
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
)(Home);