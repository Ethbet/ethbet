const Ethbet = artifacts.require("./Ethbet.sol");
const EthbetToken = artifacts.require("./EthbetToken.sol");

contract('Ethbet', (accounts) => {

  let ethbetInstance;
  let tokenInstance;

  before(async function beforeTest() {
    ethbetInstance = await Ethbet.deployed();
    tokenInstance = await EthbetToken.deployed();

    // give tokens to users 1 and 2 & 3 for testing, user 0 is the deployer
    await tokenInstance.transfer(accounts[1], 1000, {from: accounts[0]});
    await tokenInstance.transfer(accounts[2], 1000, {from: accounts[0]});
    await tokenInstance.transfer(accounts[3], 1000, {from: accounts[0]});
  });

  describe('deposit', function () {

    it('ok if transfer preapproved', async function it() {
      // first deposit
      await tokenInstance.approve(ethbetInstance.address, 400, {from: accounts[1]});
      await ethbetInstance.deposit(400, {from: accounts[1]});

      let user1BalanceInTokenContact = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 600);

      let ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 400);

      // second deposit
      await tokenInstance.approve(ethbetInstance.address, 100, {from: accounts[2]});
      await ethbetInstance.deposit(100, {from: accounts[2]});

      let user2BalanceInTokenContact = await tokenInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInTokenContact.toNumber(), 900);

      ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 500);

      let user2BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[2]);
      assert.equal(user2BalanceInEthbetContact.toNumber(), 100);
    });

    it('fails if transfer not preapproved', async function it() {
      try {
        await ethbetInstance.deposit(200, {from: accounts[3]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

  });


  describe('withdraw', function () {

    it('ok if balance sufficient', async function it() {
      await ethbetInstance.withdraw(100, {from: accounts[1]});

      let user1BalanceInTokenContact = await tokenInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInTokenContact.toNumber(), 700);

      let ethbetBalanceInTokenContact = await tokenInstance.balanceOf(ethbetInstance.address);
      assert.equal(ethbetBalanceInTokenContact.toNumber(), 400);

      let user1BalanceInEthbetContact = await ethbetInstance.balanceOf(accounts[1]);
      assert.equal(user1BalanceInEthbetContact.toNumber(), 300);
    });

    it('fails if balance insufficient', async function it() {
      try {
        await ethbetInstance.withdraw(500, {from: accounts[1]});

        // we shouldn't get to this point
        assert(false, "Transaction should have failed");
      }
      catch (err) {
        if (err.toString().indexOf("invalid opcode") < 0) {
          assert(false, err.toString());
        }
      }
    });

  });

});
