import React, { Component } from 'react';

import EthbetToken from '../build/contracts/EthbetToken.json';
import Ethbet from '../build/contracts/Ethbet.json';

import contract from 'truffle-contract';
import getWeb3 from './utils/getWeb3';


class Balance extends Component {

    constructor(props) {
        super(props);

        this.state = {
            deposit: '',
            withdraw: '',
            balance: 0,
            admin: '',
            ethbetInstane: null,
            tokenInstance: null,
            web3: null
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

     instantiateContract = async () => {

        const ethbetToken = contract(EthbetToken);
        ethbetToken.setProvider(this.state.web3.currentProvider);
        
        const ethbetContract = contract(Ethbet);
        ethbetContract.setProvider(this.state.web3.currentProvider);

        const ethbetInstance = await ethbetContract.deployed();
        const tokenInstance = await ethbetToken.deployed();
           
        await this.getDepositAmount(tokenInstance, ethbetInstance, this.state.admin);

        this.setState({
            tokenInstance,
            ethbetInstance
        });
    }


    depositTokens = async () => {

        const admin = this.state.admin;
        const tokenInstance = this.state.tokenInstance;
        
        const deposit = this.state.deposit;
        const ethbetInstance = this.state.ethbetInstane;

        console.log(deposit);

        const approve = await tokenInstance.approve.sendTransaction(ethbetInstance.address, parseInt(deposit, 10), {from: admin, value: 0});

        console.log(approve);

        //We'll have to wait for it to get mined
        await this.getDepositAmount(tokenInstance, ethbetInstance, admin);

    }

    getDepositAmount = async (tokenInstance, ethbetInstance, admin) => {
        const contractBalance = await tokenInstance.allowance.call(admin, ethbetInstance.address);

        this.setState({
            balance: contractBalance.valueOf()
        });
    }

    withdrawTokens = async () => {

        const withdraw = this.state.withdraw;
        const admin = this.state.admin;
        const ethbetInstance = this.state.ethbetInstance;

        console.log(ethbetInstance);

        try {
            //await ethbetInstance.withdraw.sendTransaction(10, {from: admin});
            const balance = await ethbetInstance.balanceOf(admin);

            console.log(balance.valueOf());
        } catch(err) {
            console.log(err);
        }

        // const balance = await ethbetInstance.balanceOf(admin);

        // this.setState({
        //     balance: balance.valueOf()
        // });
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
                        <legend>Balance: { this.state.balance } EBET</legend>

                        <div className="row">
                            <div className="col-lg-7">
                                <input name="deposit" value={ this.state.deposit } onInput={ this.handleChange } type="text" className="form-control" placeholder="Deposit tokens" />
                            </div>
                            <div className="col-lg-4">
                                <button type="button" className="btn btn-info" onClick={ this.depositTokens }>Deposit</button>
                            </div>
                        </div>

                        <hr />

                        <div className="row">
                            <div className="col-lg-7">
                                <input name="withdraw" value={ this.state.withdraw } onInput={ this.handleChange } type="text" className="form-control" placeholder="Withdraw tokens" />
                            </div>
                            <div className="col-lg-4">
                                <button type="button" className="btn btn-info" onClick={ this.withdrawTokens }>Withdraw</button>
                            </div>
                        </div>

                    </div>
                </div>
        );
    }

}

export default Balance;