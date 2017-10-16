import React, { Component } from 'react';

class ActiveBets extends Component {

    render() {
        return (
                <div className="col-lg-4"> 
                    <div className="well">
                        <legend>Active Bets</legend>

                        {/*<div className="bet">
                            <span>Amount:   </span>
                            <span>Edge:   </span>
                        </div>*/}
                    </div>
                </div>
        );
    }

}

export default ActiveBets;