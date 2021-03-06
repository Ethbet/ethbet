const EthbetOraclize = artifacts.require("./EthbetOraclize.sol");
const EthbetToken = artifacts.require("./EthbetToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

contract('EthbetOraclize', (accounts) => {

  let ethbetOraclizeInstance;
  let web3, proxiedWeb3, tokenInstance;

  before(async function beforeTest() {
    ethbetOraclizeInstance = await EthbetOraclize.deployed();
    tokenInstance = await EthbetToken.deployed();
    web3 = EthbetToken.web3;
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    // give tokens to users 1 and 2 & 3 for testing, user 0 is the deployer
    await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] });
    await tokenInstance.transfer(accounts[2], 1000, { from: accounts[0] });
    await tokenInstance.transfer(accounts[3], 1000, { from: accounts[0] });
  });


  describe('deposit', function () {

    it('ok if transfer preapproved', async function it() {
      // first deposit
      await tokenInstance.approve(ethbetOraclizeInstance.address, 400, { from: accounts[1] });
      await ethbetOraclizeInstance.deposit(400, { from: accounts[1] });

      let user1BalanceInTokenContact = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 600);

      let ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetOraclizeInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInEthbetContact = await ethbetOraclizeInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 400);

      // second deposit
      await tokenInstance.approve(ethbetOraclizeInstance.address, 600, { from: accounts[2] });
      await ethbetOraclizeInstance.deposit(600, { from: accounts[2] });

      let user2BalanceInTokenContact = await tokenInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 400);

      ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetOraclizeInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 1000);

      let user2BalanceInEthbetContact = await ethbetOraclizeInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetContact.toNumber(), 600);
    });

    it('fails if transfer not preapproved', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.deposit(200, { from: accounts[3] }));
    });
  });

  describe('withdraw', function () {

    it('ok if balance sufficient', async function it() {
      await ethbetOraclizeInstance.withdraw(100, { from: accounts[1] });

      let user1BalanceInTokenContact = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 700);

      let ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetOraclizeInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 900);

      let user1BalanceInEthbetContact = await ethbetOraclizeInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 300);
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.withdraw(500, { from: accounts[1] }));
    });
  });

  describe('depositEth', function () {

    it('ok ', async function it() {
      // first deposit
      await ethbetOraclizeInstance.depositEth({ from: accounts[1], value: web3.toWei(0.5, 'ether') });

      let contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetOraclizeInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.5, "ether"));

      let user1EthBalanceInContact = await ethbetOraclizeInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.5, "ether"));

      // second deposit
      await ethbetOraclizeInstance.depositEth({ from: accounts[2], value: web3.toWei(0.4, 'ether') });

      let user2EthBalanceInContact = await ethbetOraclizeInstance.ethBalanceOf(accounts[2]);
      assert.equal(user2EthBalanceInContact.toNumber(), web3.toWei(0.4, "ether"));

      contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetOraclizeInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.9, "ether"));
    });
  });

  describe('withdrawEth', function () {

    it('ok if balance sufficient', async function it() {
      await ethbetOraclizeInstance.withdrawEth(web3.toWei(0.2, 'ether'), { from: accounts[1] });

      let user1EthBalanceInContact = await ethbetOraclizeInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.3, "ether"));

      let contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetOraclizeInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.7, "ether"));
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.withdrawEth(web3.toWei(1, 'ether'), { from: accounts[1] }));
    });
  });

  describe('lockEthBalance', function () {

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.lockEthBalance(accounts[1], web3.toWei(0.8, "ether"), { from: accounts[0] }));
    });

    it('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.lockEthBalance(accounts[1], web3.toWei(0.2, "ether"), { from: accounts[2] }));
    });

    it('ok if balance sufficient', async function it() {
      await ethbetOraclizeInstance.lockEthBalance(accounts[1], web3.toWei(0.2, "ether"), { from: accounts[0] });

      let user1EthBalanceInContact = await ethbetOraclizeInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.1, "ether"));

      let user1LockedEthBalanceInContact = await ethbetOraclizeInstance.lockedEthBalanceOf(accounts[1]);
      assert.equal(user1LockedEthBalanceInContact.toNumber(), web3.toWei(0.2, "ether"));
    });

  });

  describe('unlockEthBalance', function () {
    it('fails if locked balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.unlockEthBalance(accounts[1], web3.toWei(0.5, "ether"), { from: accounts[0] }));
    });

    it('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.unlockEthBalance(accounts[1], web3.toWei(0.01, "ether"), { from: accounts[2] }));
    });

    it('ok if balance sufficient', async function it() {
      await ethbetOraclizeInstance.unlockEthBalance(accounts[1], web3.toWei(0.01, "ether"), { from: accounts[0] });

      let user1EthBalanceInContact = await ethbetOraclizeInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.11, "ether"));

      let user1LockedEthBalanceInContact = await ethbetOraclizeInstance.lockedEthBalanceOf(accounts[1]);
      assert.equal(user1LockedEthBalanceInContact.toNumber(), web3.toWei(0.19, "ether"));
    });
  });

  describe('chargeFeeAndLockEthBalance', function () {

    it('fails if eth balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.chargeFeeAndLockEthBalance(accounts[1], web3.toWei(0.8, "ether"), { from: accounts[0] }));
    });

    it('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.chargeFeeAndLockEthBalance(accounts[1], web3.toWei(0.01, "ether"), { from: accounts[2] }));
    });

    it('ok if balance sufficient', async function it() {
      let user1BalanceInEthbetOraclizeContact = await ethbetOraclizeInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetOraclizeContact.toNumber(), 300);

      await ethbetOraclizeInstance.chargeFeeAndLockEthBalance(accounts[1], web3.toWei(0.01, "ether"), { from: accounts[0] });

      let user1EthBalanceInContact = await ethbetOraclizeInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.1, "ether"));

      let user1LockedEthBalanceInContact = await ethbetOraclizeInstance.lockedEthBalanceOf(accounts[1]);
      assert.equal(user1LockedEthBalanceInContact.toNumber(), web3.toWei(0.2, "ether"));

      user1BalanceInEthbetOraclizeContact = await ethbetOraclizeInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetOraclizeContact.toNumber(), 100);
    });

  });

  describe('initBet', function () {

    let betId = 45;
    let maker = accounts[1];
    let caller = accounts[2];
    let amount;
    let rollUnder = 5300; // 6% edge

    before(function beforeTest() {
      amount = web3.toWei(0.2, "ether");
    });

    xit('fails if maker locked eth balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.initBet(betId, maker, caller, web3.toWei(0.6, "ether"), rollUnder, { from: accounts[0] }));
    });

    xit('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.initBet(betId, maker, caller, amount, rollUnder, { from: accounts[1] }));
    });

    xit('ok if balance sufficient', async function it() {
      let user2BalanceInEthbetOraclizeContact = await ethbetOraclizeInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetOraclizeContact.toNumber(), 600);

      let results = await ethbetOraclizeInstance.initBet(betId, maker, caller, amount, rollUnder, {
        from: accounts[0],
        value: 250000 * (10 * 10 ** 9),
        gas: 1000000
      });

      let user2LockedEthBalanceInContact = await ethbetOraclizeInstance.lockedEthBalanceOf(accounts[2]);
      assert.equal(user2LockedEthBalanceInContact.toNumber(), amount);

      // check fee was charged to caller
      user2BalanceInEthbetOraclizeContact = await ethbetOraclizeInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetOraclizeContact.toNumber(), 400);

      let log = results.logs[1];
      let loggedQueryId = log.args.queryId;

      let betData = await ethbetOraclizeInstance.bets(loggedQueryId);
      assert.equal(betData[0].toNumber(), betId);

    });

  });

  describe('setOraclizeGasPrice/setOraclizeGasLimit', function () {
    it('ok ', async function it() {
      await ethbetOraclizeInstance.setOraclizeGasPrice((20 * 10 ** 9), { from: accounts[0] });

      let oraclizeGasPrice = await ethbetOraclizeInstance.oraclizeGasPrice();
      assert.equal(oraclizeGasPrice.toNumber(), (20 * 10 ** 9));

      await ethbetOraclizeInstance.setOraclizeGasLimit((200000), { from: accounts[0] });

      let oraclizeGasLimit = await ethbetOraclizeInstance.oraclizeGasLimit();
      assert.equal(oraclizeGasLimit.toNumber(), 200000);
    });
  });

  describe('setRelay', function () {
    it('fails if initiator is not relay', async function it() {
      await expectRequireFailure(() => ethbetOraclizeInstance.setRelay(accounts[5], { from: accounts[1] }));
    });

    it('ok if initiator is relay', async function it() {
      let currentRelay = await ethbetOraclizeInstance.relay();
      assert.equal(currentRelay, accounts[0]);

      await ethbetOraclizeInstance.setRelay(accounts[5], { from: accounts[0] });

      let newRelay = await ethbetOraclizeInstance.relay();
      assert.equal(newRelay, accounts[5]);
    });
  });

});
