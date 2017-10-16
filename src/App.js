import React, { Component } from 'react';
import EthbetContract from '../build/contracts/Ethbet.json';
import getWeb3 from './utils/getWeb3';

// import Header from './Header';
import BetMaker from './BetMaker';
// import BetsHistory from "./BetsHistory";
import ActiveBets from "./ActiveBets";
import Balance from './Balance';

import './css/custom.css';
import './css/bootstrap.min.css';

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      ethbetInstane: null
    }
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(async (results) => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      await this.instantiateContract();
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  async instantiateContract() {

    const contract = require('truffle-contract');
    const ethbetContract = contract(EthbetContract);
    ethbetContract.setProvider(this.state.web3.currentProvider);
    
    const instance = await ethbetContract.deployed();

    this.setState({
      ethbetInstane: instance
    });

  }

  render() {
    return (
      <div>
        {/*<Header />*/}
        <div className="container">
          <div className="row front-row">
            <Balance />
            <BetMaker />
            <ActiveBets />
          </div>

          {/*<div className="row">
            <BetsHistory />
          </div>*/}

        </div>
      </div>
    );
  }
}

export default App
