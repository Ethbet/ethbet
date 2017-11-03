pragma solidity ^0.4.11;

import './EthbetToken.sol';

//TODO: This works if we count on only one bet at a time for a user
contract Ethbet {
    
    using SafeMath for uint256;
    
    modifier isAdmin() {
        require(msg.sender == admin);
        _;
    }
    
    modifier isRelay() {
        require(msg.sender == relay);
        _;
    }
    
    event PlaceBet(address indexed from, uint256 value);
    event Withdraw(address indexed from, uint256 value);
    event ExecutedBet(address indexed winner, address indexed loser, uint256 value);
    
    address public creator;
    address public admin;
    address public relay;
    address public feeAddress;
    
    uint256 public makerFee;   // the fee paid by the maker in EBET
    uint256 public callerFee;  // the fee paid by the caller in EBET
    
    EthbetToken public token;
    
    mapping(address => uint256) balances;
    
    function Ethbet(address _admin, address _relay, address tokenAddress, uint256 _makerFee, uint256 _callerFee) public {
        creator = msg.sender;
        admin = _admin;
        relay = _relay;
        makerFee = _makerFee;
        callerFee = _callerFee;
        token = EthbetToken(tokenAddress);
    }
    
    //This is the function user would call to deposit the tokens for their bet
    //They first need to allow the contract to spend EBET tokens in their name
    function placeBet(uint256 _amount) public {
        
        //transfer the bet amount to the contract
        token.transferFrom(msg.sender, this, _amount);
        
        //keep track of how much the user made a bet for
        balances[msg.sender] += _amount;
        
        PlaceBet(msg.sender, _amount);
    }
    
    //User withdrawing it's tokens
    //TODO: disable a withdraw while a bet is still in place
    function withdraw(uint256 _amount) public {
        require(balances[msg.sender] >= _amount);
        
        //remove the token amount from the users balance before send
        balances[msg.sender] -= _amount;
        
        //Move the funds from our contrat address to the requested user
        token.transfer(msg.sender, _amount);
        
        Withdraw(msg.sender, _amount);
    }
    
    
    //Only the realy server will call this and choose a winer
    function executeBet(address _winner, address _loser, uint _amount) isRelay public { 
        
        //The loser must have enough money to pay out the winner
        require(balances[_loser] >= _amount);
        
        //Add tokens to the winners account
        balances[_winner] += _amount;
        
        //Remove tokens from the losers account
        balances[_loser] -= _amount;
        
        //Log the event
        ExecutedBet(_winner, _loser, _amount);
    }
    
    function setAdmin(address _admin) isAdmin public {
        admin = _admin;
    }
    
    function setMakerFee(uint256 _makerFee) isAdmin public {
        makerFee = _makerFee;
    }
    
    function setCallerFee(uint256 _callerFee) isAdmin public {
        callerFee = _callerFee;
    }
    
    function setFeeAddress(address _feeAddress) isAdmin public {
        feeAddress = _feeAddress;
    }
    
    function balanceOf(address sender) constant public returns(uint256) {
        return balances[sender];
    }
    
}