import React, {Component} from 'react';

import {bindActionCreators} from 'redux';
import {connect} from 'react-redux'

import Loader from 'react-loader';
import _ from 'lodash';

import * as notificationActions from '../../actions/notificationActions';
import * as etherBetActions from '../../actions/etherBetActions';


class BetMaker extends Component {

  componentDidMount() {

  }

  updateInputValue(e, field) {
    let newBet = Object.assign({}, this.props.etherBetStore.get("newBet"));

    newBet[field] = e.target.value;

    this.props.etherBetActions.setNewBet({ newBet });
  }

  roundInputValue(e, field) {
    let newBet = Object.assign({}, this.props.etherBetStore.get("newBet"));

    newBet[field] = _.round(e.target.value, 2);

    this.props.etherBetActions.setNewBet({ newBet });
  }

  isValidNewBet() {
    let newBetAmount = parseFloat(this.props.etherBetStore.get("newBet").amount);
    let newBetEdge = parseFloat(this.props.etherBetStore.get("newBet").edge);
    return newBetAmount > 0 &&
      newBetEdge >= -99 && newBetEdge <= 99;
  }

  saveNewBet() {
    this.props.etherBetActions.saveNewBet();
  }

  render() {
    let { etherBetStore } = this.props;

    return (
      <div className="col-lg-5">
        <div className="well">
          <form className="form-horizontal">
            <legend>Offer Bet</legend>
            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 bet-row input-group">
                <input name="amount" type="text" className="form-control"
                       value={etherBetStore.get("newBet").amount}
                       onChange={(e) => this.updateInputValue(e, 'amount')}
                       onBlur={(e) => this.roundInputValue(e, 'amount')}
                       placeholder="Number of tokens"/>
                <div className="input-group-addon">EBET&nbsp;&nbsp;&nbsp;&nbsp;</div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-8 col-lg-offset-2 bet-row input-group">
                <input name="edge" type="text" className="form-control"
                       value={etherBetStore.get("newBet").edge}
                       onChange={(e) => this.updateInputValue(e, 'edge')}
                       onBlur={(e) => this.roundInputValue(e, 'edge')}

                       placeholder="Edge"/>
                <div className="input-group-addon">% Edge</div>
              </div>
            </div>

            <div className="row">
              <div className="col-lg-4 col-lg-offset-4">
                <button type="button" className="btn btn-info"
                        onClick={this.saveNewBet.bind(this)}
                        disabled={!this.isValidNewBet() || etherBetStore.get("savingNewBet")}>
                  Offer Bet
                </button>
              </div>
            </div>
            <Loader color="white" loaded={!etherBetStore.get("savingNewBet")}/>

          </form>
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
)(BetMaker);
