import React, {Component} from 'react'

import * as web3Actions from '../../actions/web3Actions';
import * as notificationActions from '../../actions/notificationActions';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import _ from 'lodash';

import Notifications from 'react-notification-system-redux';

import UsernameModal from '../UsernameModal';
import LeaderboardModal from './LeaderboardModal';
import HelpModal from '../HelpModal';

class Navbar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUsernameModalOpen: false,
      isLeaderboardModalOpen: false,
      isHelpModalOpen: false,
    };
  }

  componentDidMount() {
    this.props.web3Actions.initWeb3({ appType: "ETHER" });

    this.props.notificationActions.success({
      notification: {
        message: 'Welcome to EthBet (ETH Version)',
        position: 'br'
      }
    });
  }

  handleUsernameModalCloseRequest() {
    this.setState({ isUsernameModalOpen: false });
  }

  openUsernameModal() {
    this.setState({ isUsernameModalOpen: true });
  }

  openLeaderboardModal() {
    this.setState({ isLeaderboardModalOpen: true });
  }

  handleLeaderboardModalCloseRequest() {
    this.setState({ isLeaderboardModalOpen: false });
  }

  openHelpModal() {
    this.setState({ isHelpModalOpen: true });
  }

  handleHelpModalCloseRequest() {
    this.setState({ isHelpModalOpen: false });
  }


  render() {
    let { web3Store, userStore } = this.props;
    let web3 = web3Store.get("web3");
    let networkName = web3Store.get("networkName");
    let currentUser = userStore.get("currentUser");

    return (
      <nav className="navbar navbar-default">
        <Notifications
          notifications={this.props.notifications}
        />
        <div className="container-fluid">
          <div className="navbar-header">
            <button type="button" className="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar"
                    aria-expanded="false" aria-controls="navbar">
              <span className="sr-only">Toggle navigation</span>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
              <span className="icon-bar"/>
            </button>
            <a className="navbar-brand nav-bar-logo" href="https://ethbet.io/">
              <img className="logo-img" src="https://ethbet.io/img/logo.png" alt="Ethbet Logo"/>
            </a>
          </div>

          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a href="##" className="dropdown-toggle" data-toggle="dropdown" onClick={() => this.openHelpModal()}>
                <b>How To Play</b>
              </a>
            </li>
            <HelpModal modalIsOpen={this.state.isHelpModalOpen}
                       handleModalCloseRequest={this.handleHelpModalCloseRequest.bind(this)}/>
          </ul>

          <ul className="nav navbar-nav">
            <li className="dropdown">
              <a href="https://token.ethbet.io/" className="dropdown-toggle" target="_blank"  rel="noopener noreferrer">
                <b>Ethbet Tokens</b>
              </a>
            </li>
          </ul>

          <div id="navbar" className="navbar-collapse collapse">
            <ul className="nav navbar-nav">
              <li className="dropdown">
                <a href="##" className="dropdown-toggle" data-toggle="dropdown"
                   onClick={() => this.openLeaderboardModal()}>
                  <b>Leaderboard</b>
                </a>
              </li>
              <LeaderboardModal modalIsOpen={this.state.isLeaderboardModalOpen}
                                handleModalCloseRequest={this.handleLeaderboardModalCloseRequest.bind(this)}/>
            </ul>

            <ul className="nav navbar-nav navbar-right">
              <li className="dropdown">
                <a href="##" className="dropdown-toggle" data-toggle="dropdown">
                  <b>Network:</b> {networkName}
                </a>
              </li>

              <li className="dropdown">
                <a href="##" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false">
                  <b>Account:</b> {web3 ? _.truncate(web3.eth.defaultAccount, { length: 12 }) : null}
                  <span className="caret"></span>
                </a>
                <ul className="dropdown-menu account-menu">
                  <li><a>{web3 ? web3.eth.defaultAccount : null}</a></li>
                </ul>
              </li>

              <li className="dropdown">
                <a href="##" className="dropdown-toggle" data-toggle="dropdown" role="button" aria-haspopup="true"
                   aria-expanded="false">
                  <i className="fa fa-user" aria-hidden="true"/> &nbsp;
                  {_.get(currentUser, 'username') || "Anonymous"}
                  <span className="caret"></span>
                </a>
                <ul className="dropdown-menu username-menu">
                  <li><a href="##" onClick={() => this.openUsernameModal()}>Edit Username</a></li>
                </ul>
                <UsernameModal modalIsOpen={this.state.isUsernameModalOpen}
                               handleModalCloseRequest={this.handleUsernameModalCloseRequest.bind(this)}/>
              </li>
            </ul>
          </div>
          {/*/.nav-collapse */}
        </div>
        {/*/.container-fluid */}
      </nav>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    web3Store: state.web3Store,
    userStore: state.userStore,
    notifications: state.notifications
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    web3Actions: bindActionCreators(web3Actions, dispatch),
    notificationActions: bindActionCreators(notificationActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Navbar);