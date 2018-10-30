pragma solidity ^0.4.19;

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
  event EthDeposit(address indexed user, uint amount, uint balance);
  event EthWithdraw(address indexed user, uint amount, uint balance);
  event ExecutedBet(address indexed winner, address indexed loser, uint amount);
  event RelayAddressChanged(address relay);


  /*
   * Storage
   */
  address public relay;

  EthbetToken public token;

  // Users EBET balances
  mapping(address => uint256) balances;
  mapping(address => uint256) lockedBalances;

  // Users ETH balances
  mapping(address => uint256) public ethBalances;

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
    require(_amount > 0);
    require(balances[msg.sender] >= _amount);

    // subtract the tokens from the user's balance
    balances[msg.sender] = balances[msg.sender].sub(_amount);

    // transfer tokens from the contract to the user
    require(token.transfer(msg.sender, _amount));

    Withdraw(msg.sender, _amount, balances[msg.sender]);
  }

  /**
   * @dev deposit ETH into the contract
   */
  function depositEth() public payable {
    require(msg.value > 0);

    // add the ETH to the user's balance
    ethBalances[msg.sender] = ethBalances[msg.sender].add(msg.value);

    EthDeposit(msg.sender, msg.value, ethBalances[msg.sender]);
  }

  /**
   * @dev withdraw ETH  from the contract
   * @param _amount Amount to withdraw in WEI
   */
  function withdrawEth(uint _amount) public {
    require(_amount > 0);
    require(ethBalances[msg.sender] >= _amount);

    // subtract ether from the user's balance
    ethBalances[msg.sender] = ethBalances[msg.sender].sub(_amount);

    // transfer ether from the contract to the user
    msg.sender.transfer(_amount);

    EthWithdraw(msg.sender, _amount, ethBalances[msg.sender]);
  }


  /**
   * @dev Lock user balance to be used for bet
   * @param _userAddress User Address
   * @param _amount Amount to be locked
   * @param _fee Fee in wei to be charged
   */
  function lockBalance(address _userAddress, uint _amount, uint _fee) public isRelay {
    require(_amount > 0);
    require(balances[_userAddress] >= _amount);

    // subtract the tokens from the user's balance
    balances[_userAddress] = balances[_userAddress].sub(_amount);

    // add the tokens to the user's locked balance
    lockedBalances[_userAddress] = lockedBalances[_userAddress].add(_amount);

    if (_fee > 0) {
      // charge fees
      chargeGasFee(_userAddress, _fee);
    }

    LockedBalance(_userAddress, _amount);
  }

  /**
   * @dev charge gas fee
   * @param _userAddress User Address
   * @param _fee Fee in wei to be charged
   */
  function chargeGasFee(address _userAddress, uint _fee) internal isRelay {
    require(ethBalances[_userAddress] >= _fee);

    // charge fee
    ethBalances[_userAddress] = ethBalances[_userAddress].sub(_fee);

    // transfer ether from the contract to the relay
    relay.transfer(_fee);
  }

  /**
   * @dev Unlock user balance
   * @param _userAddress User Address
   * @param _amount Amount to be locked
   * @param _fee Fee in wei to be charged
   */
  function unlockBalance(address _userAddress, uint _amount, uint _fee) public isRelay {
    require(_amount > 0);
    require(lockedBalances[_userAddress] >= _amount);

    // subtract the tokens from the user's locked balance
    lockedBalances[_userAddress] = lockedBalances[_userAddress].sub(_amount);

    // add the tokens to the user's  balance
    balances[_userAddress] = balances[_userAddress].add(_amount);

    if (_fee > 0) {
      // charge fees
      chargeGasFee(_userAddress, _fee);
    }

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
   * @dev Get user ETH balance
   * @param _userAddress User Address
   */
  function ethBalanceOf(address _userAddress) constant public returns (uint) {
    return ethBalances[_userAddress];
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
    //The caller must have enough locked balance
    require(lockedBalances[_caller] >= _amount);

    //The maker must have enough locked balance
    require(lockedBalances[_maker] >= _amount);

    // unlock maker balance
    unlockBalance(_caller, _amount, 0);

    // unlock maker balance
    unlockBalance(_maker, _amount, 0);

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