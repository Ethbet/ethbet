/*
 * This is the official Ethbet ERC20 Token contract
 * - This token has no decimals (cannot be divided into parts)
 * - All unsold tokens are burned after the crowdsale
 * - Ethbet's token share is locked for 6 months
 * - Tokens are locked during periods such as Crowdsale
 * - Totally supply is 10M with 80% being available
 */

pragma solidity ^0.4.6;

contract SafeMath {
  function safeMul(uint a, uint b) internal returns (uint) {
    uint c = a * b;
    assert(a == 0 || c / a == b);
    return c;
  }

  function safeSub(uint a, uint b) internal returns (uint) {
    assert(b <= a);
    return a - b;
  }

  function safeAdd(uint a, uint b) internal returns (uint) {
    uint c = a + b;
    assert(c>=a && c>=b);
    return c;
  }

  function assert(bool assertion) internal {
    if (!assertion) throw;
  }
}

contract EthbetToken is SafeMath {
    /* basic token variables */
    string public standard = 'ERC20';
    string public name = 'Ethbet';
    string public symbol = 'EBET';
    uint8 public decimals = 0; // no deciminals - token CANNOT be subdivided
    uint256 public totalSupply;
    address public owner;
    /* tokens may be transfered post-Crowdsale, Oct 15th 2017 8PM UTC */
    uint256 public crowdsaleCompletedTime = 1508097600;
    /* set to true when tokens have been burned after crowdsale */
    bool burned;

    /* create an array with all balances */
    mapping (address => uint256) public balanceOf;
    mapping (address => mapping (address => uint256)) public allowance;


    /* generate a public event on the blockchain that will notify clients */
    event Transfer(address indexed from, address indexed to, uint256 value);
    event Approval(address indexed owner, address indexed spender, uint256 value);
	event Burned(uint amount);

    /* Initialize contract, giving all tokens to the creator of the contract */
    function EthbetToken() {
        owner = 0x0; // TODO: set me
        balanceOf[owner] = 10000000;              // all tokens are given to ow ner
        totalSupply = 10000000;                   // update total supply
    }

    /* send tokens to a given address */
    function transfer(address _to, uint256 _value) returns (bool success){
        if (now < crowdsaleCompletedTime) throw; // crowdsale must be completed before tokens can be sent
        if(msg.sender == owner && now < crowdsaleCompletedTime + 6 months && safeSub(balanceOf[msg.sender],_value) < 2000000) throw; // prevent reserved tokens from being spent for 6 months
        balanceOf[msg.sender] = safeSub(balanceOf[msg.sender],_value);                     // subtract from sender
        balanceOf[_to] = safeAdd(balanceOf[_to],_value);                            // add to recipient
        Transfer(msg.sender, _to, _value);                   // notify anyone listening that this transfer took place
        return true;
    }

    /* allow another contract or person to spend some tokens in your behalf */
    function approve(address _spender, uint256 _value) returns (bool success) {
        allowance[msg.sender][_spender] = _value;
        Approval(msg.sender, _spender, _value);
        return true;
    }


    /* a contract or person attempts to get the tokens of somebody else.
    *  This is only allowed if the token holder approved. */
    function transferFrom(address _from, address _to, uint256 _value) returns (bool success) {
        if (now < crowdsaleCompletedTime && _from!=owner) throw; // check if the crowdsale is already over
        if(_from == owner && now < crowdsaleCompletedTime + 6 months && safeSub(balanceOf[_from],_value) < 2000000) throw; // prevent reserved tokens from being spent for 6 months
        var _allowance = allowance[_from][msg.sender];
        balanceOf[_from] = safeSub(balanceOf[_from],_value); // subtract from sender
        balanceOf[_to] = safeAdd(balanceOf[_to],_value);     // add to recipient
        allowance[_from][msg.sender] = safeSub(_allowance,_value);
        Transfer(_from, _to, _value);
        return true;
    }


    /* called when crowdsale is finished, burning all unsold tokens except those reserved
    *  this can be called by anyone but only once */
    function burn(){
    	//if tokens have not been burned and the crowdsale is finished
    	if(!burned && now>crowdsaleCompletedTime){
    		uint difference = safeSub(balanceOf[owner], 2000000); //checked for overflow above
    		balanceOf[owner] = 2000000;
    		totalSupply = safeSub(totalSupply, difference);
    		burned = true;
    		Burned(difference);
    	}
    }

}
