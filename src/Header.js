import React, { Component } from 'react';

class Header extends Component {

    render() {
        return (
            <div className="navbar navbar-default navbar-fixed-top">
            <div className="container">
                <div className="navbar-header">
                <a href="/" className="navbar-brand">Ethbet</a>
                <button className="navbar-toggle" type="button" data-toggle="collapse" data-target="#navbar-main">
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                    <span className="icon-bar"></span>
                </button>
                </div>
                <div className="navbar-collapse collapse" id="navbar-main">
                <ul className="nav navbar-nav">
                    
                </ul>

                </div>
            </div>
            </div>
        );
    }

}

export default Header;