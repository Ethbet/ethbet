const Ethbet = artifacts.require("./Ethbet.sol");
const EthbetToken = artifacts.require("./EthbetToken.sol");

const expectRequireFailure = require('./support/expectRequireFailure');
const proxiedWeb3Handler = require('./support/proxiedWeb3Handler.js');

contract('Ethbet', (accounts) => {

  let ethbetInstance;
  let tokenInstance;
  let proxiedWeb3;

  before(async function beforeTest() {
    ethbetInstance = await Ethbet.deployed();
    tokenInstance = await EthbetToken.deployed();
    proxiedWeb3 = new Proxy(web3, proxiedWeb3Handler);

    // give tokens to users 1 and 2 & 3 for testing, user 0 is the deployer
    await tokenInstance.transfer(accounts[1], 1000, { from: accounts[0] });
    await tokenInstance.transfer(accounts[2], 1000, { from: accounts[0] });
    await tokenInstance.transfer(accounts[3], 1000, { from: accounts[0] });
  });

  describe('deposit', function () {

    it('ok if transfer preapproved', async function it() {
      // first deposit
      await tokenInstance.approve(ethbetInstance.address, 400, { from: accounts[1] });
      await ethbetInstance.deposit(400, { from: accounts[1] });

      let user1BalanceInTokenContact = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 600);

      let ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 400);

      // second deposit
      await tokenInstance.approve(ethbetInstance.address, 100, { from: accounts[2] });
      await ethbetInstance.deposit(100, { from: accounts[2] });

      let user2BalanceInTokenContact = await tokenInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 900);

      ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 500);

      let user2BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetContact.toNumber(), 100);
    });

    it('fails if transfer not preapproved', async function it() {
      await expectRequireFailure(() => ethbetInstance.deposit(200, { from: accounts[3] }));
    });

  });


  describe('withdraw', function () {

    it('ok if balance sufficient', async function it() {
      await ethbetInstance.withdraw(100, { from: accounts[1] });

      let user1BalanceInTokenContact = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 700);

      let ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 300);
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetInstance.withdraw(500, { from: accounts[1] }));
    });
  });


  describe('depositEth', function () {

    it('ok ', async function it() {
      // first deposit
      await ethbetInstance.depositEth({ from: accounts[1], value: web3.toWei(0.5, 'ether') });

      let contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.5, "ether"));

      let user1EthBalanceInContact = await ethbetInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.5, "ether"));

      // second deposit
      await ethbetInstance.depositEth({ from: accounts[2], value: web3.toWei(0.4, 'ether') });

      let user2EthBalanceInContact = await ethbetInstance.ethBalanceOf(accounts[2]);
      assert.equal(user2EthBalanceInContact.toNumber(), web3.toWei(0.4, "ether"));

      contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.9, "ether"));
    });
  });

  describe('withdrawEth', function () {

    it('ok if balance sufficient', async function it() {
      await ethbetInstance.withdrawEth(web3.toWei(0.2, 'ether'), { from: accounts[1] });

      let user1EthBalanceInContact = await ethbetInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.3, "ether"));

      let contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.7, "ether"));
    });

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetInstance.withdrawEth(web3.toWei(1, 'ether'), { from: accounts[1] }));
    });
  });


  describe('lockBalance', function () {

    it('fails if balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetInstance.lockBalance(accounts[1], 500, web3.toWei(0.01, "ether"), { from: accounts[0] }));
    });

    it('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetInstance.lockBalance(accounts[1], 100, web3.toWei(0.01, "ether"), { from: accounts[2] }));
    });

    it('fails if fees more than balance', async function it() {
      await expectRequireFailure(() => ethbetInstance.lockBalance(accounts[1], 100, web3.toWei(0.5, "ether"), { from: accounts[0] }));
    });

    it('ok if balance sufficient', async function it() {
      let user0EthBalance = await proxiedWeb3.eth.getBalance(accounts[0]);

      await ethbetInstance.lockBalance(accounts[1], 100, web3.toWei(0.01, "ether"), {
        from: accounts[0],
        gasPrice: 2 * 10 ** 9
      });

      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 200);

      let user1LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[1]);
      assert.equal(user1LockedBalanceInEthbetContact.toNumber(), 100);

      let user1EthBalanceInContact = await ethbetInstance.ethBalanceOf(accounts[1]);
      assert.equal(user1EthBalanceInContact.toNumber(), web3.toWei(0.29, "ether"));

      let contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.69, "ether"));

      let user0EthBalanceAfterLock = await proxiedWeb3.eth.getBalance(accounts[0]);
      assert.isAbove(user0EthBalanceAfterLock.sub(user0EthBalance).toNumber(), web3.toWei(0.009, "ether")); // check fees transferred to relay
    });

  });

  describe('unlockBalance', function () {
    it('fails if locked balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetInstance.unlockBalance(accounts[1], 500, web3.toWei(0.02, "ether"), { from: accounts[0] }));
    });

    it('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetInstance.unlockBalance(accounts[1], 50, web3.toWei(0.02, "ether"), { from: accounts[2] }));
    });

    it('fails if fees more than balance', async function it() {
      await expectRequireFailure(() => ethbetInstance.unlockBalance(accounts[1], 50, web3.toWei(0.5, "ether"), { from: accounts[0] }));
    });

    it('ok if balance sufficient', async function it() {
      let user0EthBalance = await proxiedWeb3.eth.getBalance(accounts[0]);

      await ethbetInstance.unlockBalance(accounts[1], 50, web3.toWei(0.02, "ether"), {
        from: accounts[0],
        gasPrice: 2 * 10 ** 9
      });

      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 250);

      let user1LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[1]);
      assert.equal(user1LockedBalanceInEthbetContact.toNumber(), 50);

      let contractEthBalance = await proxiedWeb3.eth.getBalance(ethbetInstance.address);
      assert.equal(contractEthBalance.toNumber(), web3.toWei(0.67, "ether"));

      let user0EthBalanceAfterLock = await proxiedWeb3.eth.getBalance(accounts[0]);
      assert.isAbove(user0EthBalanceAfterLock.sub(user0EthBalance).toNumber(), web3.toWei(0.019, "ether")); // check fees transferred to relay

    });
  });


  describe('executeBet', function () {

    before(async function beforeTest() {
      // check preconditions
      // user 1 is maker
      // user 2 is caller
      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 250);

      let user1LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[1]);
      assert.equal(user1LockedBalanceInEthbetContact.toNumber(), 50);

      let user2BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetContact.toNumber(), 100);

      let user2LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[2]);
      assert.equal(user2LockedBalanceInEthbetContact.toNumber(), 0);
    });


    it('fails if not executed by relay', async function it() {
      await expectRequireFailure(() => ethbetInstance.executeBet(accounts[1], accounts[2], true, 30, { from: accounts[1] }));
    });

    it('fails if caller balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetInstance.executeBet(accounts[1], accounts[2], true, 150, { from: accounts[0] }));
    });

    it('fails if maker locked balance insufficient', async function it() {
      await expectRequireFailure(() => ethbetInstance.executeBet(accounts[1], accounts[2], true, 60, { from: accounts[0] }));
    });

    it('ok if balances sufficient / maker won', async function it() {
      // lock necessary balance
      await ethbetInstance.lockBalance(accounts[2], 30, web3.toWei(0.01, "ether"), { from: accounts[0] });

      await ethbetInstance.executeBet(accounts[1], accounts[2], true, 30, { from: accounts[0] });

      // 250 initial + 30 unlocked + 30 won
      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 310);

      // 50 initial - 30 unlocked
      let user1LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[1]);
      assert.equal(user1LockedBalanceInEthbetContact.toNumber(), 20);

      // 100 initial - 30 lost
      let user2BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetContact.toNumber(), 70);

      // 0 initial , no changes
      let user2LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[2]);
      assert.equal(user2LockedBalanceInEthbetContact.toNumber(), 0);
    });

    it('ok if balances sufficient / maker lost', async function it() {
      // lock necessary balance
      await ethbetInstance.lockBalance(accounts[2], 20, web3.toWei(0.01, "ether"), { from: accounts[0] });

      await ethbetInstance.executeBet(accounts[1], accounts[2], false, 20, { from: accounts[0] });

      // 310 initial + 20 unlocked - 20 lost
      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 310);

      // 20 initial - 20 lost
      let user1LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[1]);
      assert.equal(user1LockedBalanceInEthbetContact.toNumber(), 0);

      // 70 initial + 20 won
      let user2BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetContact.toNumber(), 90);

      // 0 initial , no changes
      let user2LockedBalanceInEthbetContact = await ethbetInstance.lockedBalanceOf(accounts[2]);
      assert.equal(user2LockedBalanceInEthbetContact.toNumber(), 0);
    });

  });

  describe('setRelay', function () {
    it('fails if initiator is not relay', async function it() {
      await expectRequireFailure(() => ethbetInstance.setRelay(accounts[5], { from: accounts[1] }));
    });

    it('ok if initiator is relay', async function it() {
      let currentRelay = await ethbetInstance.relay();
      assert.equal(currentRelay, accounts[0]);

      await ethbetInstance.setRelay(accounts[5], { from: accounts[0] });

      let newRelay = await ethbetInstance.relay();
      assert.equal(newRelay, accounts[5]);
    });
  });


});
