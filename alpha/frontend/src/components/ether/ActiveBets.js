import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import _ from 'lodash';

import Loader from 'react-loader';

import * as notificationActions from '../../actions/notificationActions';
import * as etherBetActions from '../../actions/etherBetActions';



import ActiveBet from "./ActiveBet";

class ActiveBets extends Component {

  getActiveBets() {
    let opts = this.props.etherBetStore.get("activeBetsLoadOpts");
    return _.orderBy(_.uniqBy(this.props.etherBetStore.get("activeBets"), 'id'), [opts.orderField], [opts.orderDirection.toLowerCase()]);
  }

  setActiveBetsLoadOpts(e, opts) {
    e.preventDefault();
    opts.offset = 0; // reload all
    this.props.etherBetActions.setActiveBetsLoadOpts({activeBetsLoadOpts: opts});
    this.props.etherBetActions.getActiveBets();
  }

  loadMore(bets) {
    let activeBetsLoadOpts = this.props.etherBetStore.get("activeBetsLoadOpts");
    activeBetsLoadOpts.offset = bets.length;
    this.props.etherBetActions.setActiveBetsLoadOpts({activeBetsLoadOpts});
    this.props.etherBetActions.getActiveBets();
  }

  showLoadMore(bets, activeBetsTotalCount) {
    return bets.length < activeBetsTotalCount;
  }

  render() {
    let {etherBetStore} = this.props;

    let activeBets = this.getActiveBets();
    let activeBetsTotalCount = this.props.etherBetStore.get("activeBetsTotalCount");

    return (
      <div className="col-lg-12">
        <div className="well">
          <legend>Active Bets
            <div className="btn-group pull-right">
              <button type="button" className="btn btn-default dropdown-toggle" data-toggle="dropdown"
                      aria-haspopup="true" aria-expanded="true">
                Sort <span className="caret"/>
              </button>
              <ul className="dropdown-menu">
                <li>
                  <a href="##"
                     onClick={(e) => this.setActiveBetsLoadOpts(e, {orderField: 'edge', orderDirection: 'ASC'})}>
                    Lowest Edge First
                  </a>
                </li>
                <li>
                  <a href="##"
                     onClick={(e) => this.setActiveBetsLoadOpts(e, {orderField: 'edge', orderDirection: 'DESC'})}>
                    Highest Edge First
                  </a>
                </li>
                <li role="separator" className="divider"/>
                <li>
                  <a href="##"
                     onClick={(e) => this.setActiveBetsLoadOpts(e, {orderField: 'amount', orderDirection: 'ASC'})}>
                    Lowest Value First
                  </a>
                </li>
                <li>
                  <a href="##"
                     onClick={(e) => this.setActiveBetsLoadOpts(e, {orderField: 'amount', orderDirection: 'DESC'})}>
                    Highest Value First
                  </a>
                </li>
                <li role="separator" className="divider"/>
                <li>
                  <a href="##"
                     onClick={(e) => this.setActiveBetsLoadOpts(e, {orderField: 'createdAt', orderDirection: 'DESC'})}>
                    Newest First
                  </a>
                </li>
                <li>
                  <a href="##"
                     onClick={(e) => this.setActiveBetsLoadOpts(e, {orderField: 'createdAt', orderDirection: 'ASC'})}>
                    Oldest First
                  </a>
                </li>
              </ul>
            </div>
          </legend>

          <div className="row">
            {activeBets.map((bet) => (
              <ActiveBet bet={bet} key={bet.id}/>
            ))}
          </div>

          <div className="row">
            {this.showLoadMore(activeBets, activeBetsTotalCount) ?
              <button type="button" className="btn btn-primary"
                      disabled={etherBetStore.get("gettingActiveBets")}
                      onClick={() => this.loadMore(activeBets)}>
                Load More
              </button>
              : null
            }
          </div>

          <Loader color="white" loaded={!etherBetStore.get("gettingActiveBets")}/>
        </div>
      </div>
    );
  }

}

const mapStateToProps = (state) => {
  return {
    etherBetStore: state.etherBetStore,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    notificationActions: bindActionCreators(notificationActions, dispatch),
    etherBetActions: bindActionCreators(etherBetActions, dispatch),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ActiveBets);