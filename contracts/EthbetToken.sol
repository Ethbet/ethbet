pragma solidity ^0.4.11;


import "zeppelin-solidity/contracts/token/StandardToken.sol";


/**
 * @title EthbetToken
 * @dev Very simple ERC20 Token example, where all tokens are pre-assigned to the creator.
 * Note they can later distribute these tokens as they wish using `transfer` and other
 * `StandardToken` functions.
 */
contract EthbetToken is StandardToken {

  string public constant name = "Ethbet";
  string public constant symbol = "EBET";
  uint8 public constant decimals = 2; // only two deciminals, token cannot be divided past 1/100th

  uint256 public constant INITIAL_SUPPLY = 1000000000; // 10 million + 2 decimals

    /* tokens may be transfered post-Crowdsale, Oct 15th 2017 8PM UTC */
    uint256 public crowdsaleCompletedTime = 1508097600;

  /**
   * @dev Contructor that gives msg.sender all of existing tokens.
   */
  function EthbetToken() {
    totalSupply = INITIAL_SUPPLY;
    balances[msg.sender] = INITIAL_SUPPLY;
  }

}

