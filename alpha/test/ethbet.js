const Ethbet = artifacts.require("./Ethbet.sol");
const EthbetToken = artifacts.require("./EthbetToken.sol");

contract('Ethbet', (accounts)  => {

  const admin = accounts[0];

  //Before we start the test let the user approve a bit of EBET tokens to spend
  before(async () => {

    const ethbetInstance = await Ethbet.deployed();
    const tokenInstance = await EthbetToken.deployed();

    const balance = await tokenInstance.balanceOf(admin);

    //call the approve method so the contract can spend tokens
    const approve = await tokenInstance.approve.sendTransaction(ethbetInstance.address, 100, {from: admin, value: 0});

    const contractBalance = await tokenInstance.allowance(admin, ethbetInstance.address);

  });

  it("...a user should place a bet", async () => {

    const ethbetInstance = await Ethbet.deployed();

    await ethbetInstance.placeBet.sendTransaction(50, {from: admin});

    const balance = await ethbetInstance.balanceOf(admin);

    assert.equal(balance.valueOf(), 50, "The user placed 50 EBET into the contract");
  });


  it("...a user should widraw his money", async () => {

    const ethbetInstance = await Ethbet.deployed();

    await ethbetInstance.withdraw.sendTransaction(30, {from: admin});

    const balance = await ethbetInstance.balanceOf(admin);

    assert.equal(balance.valueOf(), 20, "The user widtdrew 30 tokens and has 20 left");
  });

});
