pragma solidity 0.4.18;

import './EthbetToken.sol';

// Import newer SafeMath version under new name to avoid conflict with the version included in EthbetToken
import {SafeMath as SafeMath2} from "./SafeMath.sol";

contract Ethbet {
  using SafeMath2 for uint256;

  /*
  * Events
  */

  event Deposit(address indexed user, uint amount, uint balance);

  event Withdraw(address indexed user, uint amount, uint balance);

  event LockedBalance(address indexed user, uint amount);

  event UnlockedBalance(address indexed user, uint amount);

  event ExecutedBet(address indexed winner, address indexed loser, uint amount);

  event RelayAddressChanged(address relay);


  /*
   * Storage
   */
  address public relay;

  EthbetToken public token;

  mapping(address => uint256) balances;

  mapping(address => uint256) lockedBalances;

  /*
  * Modifiers
  */

  modifier isRelay() {
    require(msg.sender == relay);
    _;
  }

  /*
  * Public functions
  */

  /**
  * @dev Contract constructor
  * @param _relay Relay Address
  * @param _tokenAddress Ethbet Token Address
  */
  function Ethbet(address _relay, address _tokenAddress) public {
    // make sure relay address set
    require(_relay != address(0));

    relay = _relay;
    token = EthbetToken(_tokenAddress);
  }

  /**
  * @dev set relay address
  * @param _relay Relay Address
  */
  function setRelay(address _relay) public isRelay {
    // make sure address not null
    require(_relay != address(0));

    relay = _relay;

    RelayAddressChanged(_relay);
  }

  /**
   * @dev deposit EBET tokens into the contract
   * @param _amount Amount to deposit
   */
  function deposit(uint _amount) public {
    require(_amount > 0);

    // token.approve needs to be called beforehand
    // transfer tokens from the user to the contract
    require(token.transferFrom(msg.sender, this, _amount));

    // add the tokens to the user's balance
    balances[msg.sender] = balances[msg.sender].add(_amount);

    Deposit(msg.sender, _amount, balances[msg.sender]);
  }

  /**
   * @dev withdraw EBET tokens from the contract
   * @param _amount Amount to withdraw
   */
  function withdraw(uint _amount) public {
    require(balances[msg.sender] >= _amount);

    // subtract the tokens from the user's balance
    balances[msg.sender] = balances[msg.sender].sub(_amount);

    // transfer tokens from the contract to the user
    require(token.transfer(msg.sender, _amount));

    Withdraw(msg.sender, _amount, balances[msg.sender]);
  }


  /**
   * @dev Lock user balance to be used for bet
   * @param _userAddress User Address
   * @param _amount Amount to be locked
   */
  function lockBalance(address _userAddress, uint _amount) public isRelay {
    require(balances[_userAddress] >= _amount);

    // subtract the tokens from the user's balance
    balances[_userAddress] = balances[_userAddress].sub(_amount);

    // add the tokens to the user's locked balance
    lockedBalances[_userAddress] = lockedBalances[_userAddress].add(_amount);

    LockedBalance(_userAddress, _amount);
  }

  /**
   * @dev Unlock user balance
   * @param _userAddress User Address
   * @param _amount Amount to be locked
   */
  function unlockBalance(address _userAddress, uint _amount) public isRelay {
    require(lockedBalances[_userAddress] >= _amount);

    // subtract the tokens from the user's locked balance
    lockedBalances[_userAddress] = lockedBalances[_userAddress].sub(_amount);

    // add the tokens to the user's  balance
    balances[_userAddress] = balances[_userAddress].add(_amount);

    UnlockedBalance(_userAddress, _amount);
  }

  /**
  * @dev Get user balance
  * @param _userAddress User Address
  */
  function balanceOf(address _userAddress) constant public returns (uint) {
    return balances[_userAddress];
  }

  /**
  * @dev Get user locked balance
  * @param _userAddress User Address
  */
  function lockedBalanceOf(address _userAddress) constant public returns (uint) {
    return lockedBalances[_userAddress];
  }

  /**
   * @dev Execute bet
   * @param _maker Maker Address
   * @param _caller Caller Address
   * @param _makerWon Did the maker win
   * @param _amount amount
   */
  function executeBet(address _maker, address _caller, bool _makerWon, uint _amount) isRelay public {
    //The caller must have enough balance
    require(balances[_caller] >= _amount);

    //The maker must have enough locked balance
    require(lockedBalances[_maker] >= _amount);

    // unlock maker balance
    unlockBalance(_maker, _amount);

    var winner = _makerWon ? _maker : _caller;
    var loser = _makerWon ? _caller : _maker;

    // add the tokens to the winner's balance
    balances[winner] = balances[winner].add(_amount);
    // remove the tokens from the loser's  balance
    balances[loser] = balances[loser].sub(_amount);

    //Log the event
    ExecutedBet(winner, loser, _amount);
  }

}