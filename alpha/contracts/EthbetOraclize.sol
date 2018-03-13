pragma solidity ^0.4.19;

import './EthbetToken.sol';

// Import newer SafeMath version under new name to avoid conflict with the version included in EthbetToken
import {SafeMath as SafeMath2} from "./SafeMath.sol";

contract EthbetOraclize {
  using SafeMath2 for uint256;

  /*
  * Events
  */

  event Deposit(address indexed user, uint amount, uint balance);
  event Withdraw(address indexed user, uint amount, uint balance);
  event EthDeposit(address indexed user, uint amount, uint balance);
  event EthWithdraw(address indexed user, uint amount, uint balance);
  event RelayAddressChanged(address relay);

  /*
  * Storage
  */

  // relay address
  address public relay;

  // EBET token address
  EthbetToken public token;

  // Users EBET balances
  mapping(address => uint256) balances;

  // Users ETH balances
  mapping(address => uint256) ethBalances;
  mapping(address => uint256) lockedEthBalances;

  /*
  * Modifiers
  */

  modifier isRelay() {
    require(msg.sender == relay);
    _;
  }

  /*
  * Functions
  */

  /**
  * @dev Contract constructor
  * @param _relay Relay Address
  * @param _tokenAddress Ethbet Token Address
  */
  function EthbetOraclize(address _relay, address _tokenAddress) public {
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

    // subtract the tokens from the user's balance
    ethBalances[msg.sender] = ethBalances[msg.sender].sub(_amount);

    // transfer tokens from the contract to the user
    msg.sender.transfer(_amount);

    EthWithdraw(msg.sender, _amount, ethBalances[msg.sender]);
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
   * @dev Get user's locked ETH balance
   * @param _userAddress User Address
   */
  function lockedEthBalanceOf(address _userAddress) constant public returns (uint) {
    return lockedEthBalances[_userAddress];
  }

}