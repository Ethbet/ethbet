import React, { Component } from 'react';

import Ethbet from '../build/contracts/Ethbet.json';

import contract from 'truffle-contract';
import getWeb3 from './utils/getWeb3';

class BetMaker extends Component {

    constructor(props) {
        super(props);

        this.state = {
            value: '',
            edge: '',
            admin: '',
            web3: null,
            ethbetInstance: null
        };
    }

    componentDidMount() {

        getWeb3
        .then(async (results) => {
            this.setState({
                web3: results.web3
            })

            results.web3.eth.getAccounts( async (error, accounts) => {

                this.setState({
                    admin: accounts[0]
                });

                // Instantiate contract once web3 provided.
                await this.instantiateContract();

            });

        });
    }

    makeBet = async () => {

        const ethbetInstance = this.state.ethbetInstance;
        const admin = this.state.admin;
        const numTokens = this.state.value;

        await ethbetInstance.placeBet.sendTransaction(numTokens, {from: admin});

        //Wait for the block to get mined 

        const balance = await ethbetInstance.balanceOf(admin);

        console.log(balance.valueOf());

        this.setState({
            value: '',
            edge: ''
        });
    }

    instantiateContract = async () => {

        const ethbetContract = contract(Ethbet);
        ethbetContract.setProvider(this.state.web3.currentProvider);

        const ethbetInstance = await ethbetContract.deployed();
            
        this.setState({
            ethbetInstance
        });
    }

    handleChange = (event) => {
        this.setState({
            [event.target.name] : event.target.value
        });
    }

    render() {
        return (
            <div className="col-lg-4"> 
                 <div className="well">
                    <form className="form-horizontal">
                    <legend>Make bet</legend>
                        <div className="row">
                            <div className="col-lg-8 col-lg-offset-2 bet-row">
                                <input name="value" value={ this.state.value } onInput={ this.handleChange } type="text" className="form-control" placeholder="Number of tokens" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-8 col-lg-offset-2 bet-row">
                                <input name="edge" value={ this.state.edge } onInput={ this.handleChange } type="text" className="form-control" placeholder="Edge" />
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-lg-4 col-lg-offset-4">
                                <button type="button" className="btn btn-info" onClick={ this.makeBet }>Offer Bet</button>
                            </div>
                        </div>

                        </form>
                    </div>
            </div>
        );
    }

}

export default BetMaker;