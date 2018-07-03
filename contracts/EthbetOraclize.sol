pragma solidity ^0.4.19;

import './EthbetToken.sol';

// Import newer SafeMath version under new name to avoid conflict with the version included in EthbetToken
//import "./SafeMath.sol";

import './Ownable.sol';
import './oraclizeAPI_0.4.sol';


contract EthbetOraclize is Ownable, usingOraclize {
  using SafeMath for uint256;

  /*
  * Events
  */

  event Deposit(address indexed user, uint amount, uint balance);
  event Withdraw(address indexed user, uint amount, uint balance);
  event EthDeposit(address indexed user, uint amount, uint balance);
  event EthWithdraw(address indexed user, uint amount, uint balance);
  event LockedEthBalance(address indexed user, uint amount);
  event UnlockedEthBalance(address indexed user, uint amount);
  event BetInitialized(uint betId, bytes32 queryId);
  event RelayAddressChanged(address relay);
  event ExecutedBet(uint indexed betId, address winner, address loser, uint amount);

  /*
  * Storage
  */

  // bet fee in ebet (2 decimals)
  uint constant ebetFee = 200;

  // relay address
  address public relay;

  // EBET token address
  EthbetToken public token;

  // Users EBET balances
  mapping(address => uint256) public balances;

  // Users ETH balances
  mapping(address => uint256) public ethBalances;
  mapping(address => uint256) public lockedEthBalances;

  // Oraclize gas limit to use
  uint public oraclizeGasLimit;
  // Oraclize gas price to use
  uint public oraclizeGasPrice;

  // Bets indexed by oraclize query id
  mapping(bytes32 => Bet) public bets;

  // Bet id to query id mapping
  mapping(uint => bytes32) public queryIds;

  /**
   * @dev Bet struct
   * @param maker Maker Address
   * @param caller Caller Address
   * @param amount bet amount in wei
   * @param rollUnder max roll for the maker to win, 2 decimals
   * @param roll actual roll calculated by oraclize, 2 decimals
   * @param makerWon did the maker win ?
   * @param executedAt bet execution timestamp in milliseconds
   */
  struct Bet {
    uint betId;
    address maker;
    address caller;
    uint amount;
    uint rollUnder;
    string rawResult;
    uint roll;
    bool makerWon;
    uint executedAt;
  }

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
   * @param _oraclizeGasLimit Oraclize gas limit
   * @param _oraclizeGasPrice Oraclize gas price
   * @param _isDevelopment set to true if development mode
   */
  function EthbetOraclize(address _relay, address _tokenAddress, uint _oraclizeGasLimit, uint _oraclizeGasPrice, bool _isDevelopment) public {
    // make sure relay address set
    require(_relay != address(0));

    // set relay and token
    relay = _relay;
    token = EthbetToken(_tokenAddress);

    // setup oraclize
    setupOraclize(_oraclizeGasLimit, _oraclizeGasPrice, _isDevelopment);
  }

  /**
   * @dev setup oraclize
   * @param _oraclizeGasLimit Oraclize gas limit
   * @param _oraclizeGasPrice Oraclize gas price
   * @param _isDevelopment set to true if development mode
   */
  function setupOraclize(uint _oraclizeGasLimit, uint _oraclizeGasPrice, bool _isDevelopment) internal {
    if (_isDevelopment) {
      // set OAR for testrpc
      OAR = OraclizeAddrResolverI(0x6f485C8BF6fc43eA212E93BBF8ce046C7f1cb475);
    }
    else {
      oraclize_setNetwork(networkID_auto);
      oraclize_setProof(proofType_Ledger);
    }

    // set gas limit
    setOraclizeGasLimit(_oraclizeGasLimit);
    // set gas price
    setOraclizeGasPrice(_oraclizeGasPrice);
  }

  /**
  * @dev set relay address
  * @param _relay Relay Address
  */
  function setRelay(address _relay) public onlyOwner {
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
  * @dev charge fee and lock eth balance
  * @param _userAddress User Address
  * @param _amount Amount to be locked in wei
  */
  function chargeFeeAndLockEthBalance(address _userAddress, uint _amount) public isRelay {
    // charge fee
    chargeFee(_userAddress);

    // lock balance
    lockEthBalance(_userAddress, _amount);
  }

  /**
   * @dev charge fee
   * @param _userAddress User Address
   */
  function chargeFee(address _userAddress) internal isRelay {
    require(balances[_userAddress] >= ebetFee);

    // charge fee
    balances[_userAddress] = balances[_userAddress].sub(ebetFee);
    balances[owner] = balances[owner].add(ebetFee);
  }

  /**
   * @dev Lock user eth balance to be used for bet
   * @param _userAddress User Address
   * @param _amount Amount to be locked in wei
   */
  function lockEthBalance(address _userAddress, uint _amount) public isRelay {
    require(_amount > 0);
    require(ethBalances[_userAddress] >= _amount);

    // subtract the amount from the user's balance
    ethBalances[_userAddress] = ethBalances[_userAddress].sub(_amount);

    // add the amount to the user's locked balance
    lockedEthBalances[_userAddress] = lockedEthBalances[_userAddress].add(_amount);

    LockedEthBalance(_userAddress, _amount);
  }

  /**
   * @dev Unlock user eth balance
   * @param _userAddress User Address
   * @param _amount Amount to be locked in wei
   */
  function unlockEthBalance(address _userAddress, uint _amount) public isRelay {
    require(_amount > 0);
    require(lockedEthBalances[_userAddress] >= _amount);

    // subtract the tokens from the user's locked balance
    lockedEthBalances[_userAddress] = lockedEthBalances[_userAddress].sub(_amount);

    // add the tokens to the user's  balance
    ethBalances[_userAddress] = ethBalances[_userAddress].add(_amount);

    UnlockedEthBalance(_userAddress, _amount);
  }

  /**
  * @dev Init bet
  * @param _betId Bet Id
  * @param _maker Maker Address
  * @param _caller Caller Address
  * @param _amount amount in Wei
  * @param _rollUnder roll under (2 decimals)
  */
  function initBet(uint _betId, address _maker, address _caller, uint _amount, uint _rollUnder) payable isRelay public {
    require(_betId > 0);
    require(!isBetInitialized(_betId));
    require(_maker != address(0));
    require(_caller != address(0));
    require(_amount > 0);
    // check _rollUnder is valid (2 decimals)
    require(_rollUnder > 0 && _rollUnder < 10000);

    // lock the bet amount for the caller
    chargeFeeAndLockEthBalance(_caller, _amount);

    // check locked eth balances are sufficient
    require(lockedEthBalances[_maker] >= _amount);
    require(lockedEthBalances[_caller] >= _amount);

    // check gas sent is sufficient for query costs
    require(oraclize.getPrice("random") <= msg.value);

    // init bet
    Bet memory bet = Bet(_betId, _maker, _caller, _amount, _rollUnder, "", 0, false, 0);

    // number of random bytes we want the datasource to return
    // 2 is enough to generate the roll number 0 < x < 10000
    uint N = 2;
    // delay to wait
    uint delay = 0;

    // this function internally generates the correct oraclize_query and returns its queryId
    bytes32 queryId = oraclize_newRandomDSQuery(delay, N, oraclizeGasLimit);
    //bytes32 queryId = oraclize_query("nested", "[URL] ['json(https://api.random.org/json-rpc/1/invoke).result.random[\"serialNumber\",\"data\"]', '\\n{\"jsonrpc\":\"2.0\",\"method\":\"generateSignedIntegers\",\"params\":{\"apiKey\":${[decrypt] BK8UxIEHLaY8JEQDl1sjK73+fDZaze2oRyp3OzgI3Q1Xbz7xFGJ7pKtmKXdyiML5e26HYeoxO4fOFoVQ7iHBVd3Olm0gowJ60oIiC+OfrOB+dsoobaztcFmEKMgh7bLXREL9ORAb7rUD4DVlH4NpxQ4mfkgKvtE=},\"n\":1,\"min\":1,\"max\":100,\"replacement\":true,\"base\":10${[identity] \"}\"},\"id\":1${[identity] \"}\"}']", oraclizeGasLimit);

    // save the bet
    bets[queryId] = bet;
    queryIds[_betId] = queryId;

    BetInitialized(_betId, queryId);
  }


  /**
   * @dev Oraclize callback
   * @param _queryId Query Id
   * @param _result Result
   * @param _proof Proof
   */
  function __callback(bytes32 _queryId, string _result, bytes _proof)
  {
    if (msg.sender != oraclize_cbAddress()) throw;

    if (oraclize_randomDS_proofVerify__returnCode(_queryId, _result, _proof) != 0) {
      // the proof verification has failed
    } else {
      // the random number was safely generated

      Bet storage bet = bets[_queryId];

      // check bet exists
      require(bet.betId > 0);
      // check bet exists not already executed
      require(bet.executedAt == 0);

      // this is the highest uint we want to get, 100 with 2 decimals
      uint maxRange = 10000;
      // this is the highest uint we want to get.
      // convert the random bytes to uint and get the uint out in the [0, maxRange] range
      uint roll = uint(sha3(_result)) % maxRange;

      bet.rawResult = _result;
      bet.roll = roll;
      bet.executedAt = block.timestamp * 1000;
      if (roll <= bet.rollUnder) {
        bet.makerWon = true;
      }

      // unlock eth balances

      // subtract the tokens from the maker's locked balance
      lockedEthBalances[bet.maker] = lockedEthBalances[bet.maker].sub(bet.amount);
      // add the tokens to the maker's balance
      ethBalances[bet.maker] = ethBalances[bet.maker].add(bet.amount);

      // subtract the tokens from the caller's locked balance
      lockedEthBalances[bet.caller] = lockedEthBalances[bet.caller].sub(bet.amount);
      // add the tokens to the caller's balance
      ethBalances[bet.caller] = ethBalances[bet.caller].add(bet.amount);

      var winner = bet.makerWon ? bet.maker : bet.caller;
      var loser = bet.makerWon ? bet.caller : bet.maker;

      // add the tokens to the winner's balance
      ethBalances[winner] = ethBalances[winner].add(bet.amount);
      // remove the tokens from the loser's balance
      ethBalances[loser] = ethBalances[loser].sub(bet.amount);

      // log event
      ExecutedBet(bet.betId, winner, loser, bet.amount);
    }
  }

  /**
  * @dev Get Oraclize Price with current params
  */
  function getOraclizePrice() public constant returns (uint) {
    return oraclize.getPrice("random");
  }

  /**
   * @dev Set Oraclize Gas limit
   * @param _gasLimit gas limit
   */
  function setOraclizeGasLimit(uint _gasLimit) public onlyOwner
  {
    oraclizeGasLimit = _gasLimit;
  }

  /**
   * @dev Set Oraclize Gas Price
   * @param _gasPrice gas price in wei
   */
  function setOraclizeGasPrice(uint _gasPrice) public onlyOwner
  {
    oraclizeGasPrice = _gasPrice;
    oraclize_setCustomGasPrice(_gasPrice);
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

  /**
  * @dev Get bet by id
  * @param _betId Bet Id
  */
  function getBetById(uint _betId) constant public
  returns (address maker, address caller, uint amount, uint rollUnder, bytes rawResultInBytes, uint roll, bool makerWon, uint executedAt)
  {
    Bet memory bet = bets[queryIds[_betId]];
    return (bet.maker, bet.caller, bet.amount, bet.rollUnder, bytes(bet.rawResult), bet.roll, bet.makerWon, bet.executedAt);
  }

  /**
  * @dev Is Bet Initialized
  * @param _betId Bet Id
  */
  function isBetInitialized(uint _betId) constant public returns (bool) {
    return queryIds[_betId] != 0;
  }


}