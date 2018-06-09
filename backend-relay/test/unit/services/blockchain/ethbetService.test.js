const expect = require('chai').expect;
const sinon = require('sinon');

let ethbetService = require('../../../../lib/blockchain/ethbetService');
const contractService = require('../../../../lib/contractService');
const web3Service = require('../../../../lib/web3Service');

const testAddress = require('../../../support/testAddress.json');


describe('ethbetService', function ethbetServiceTest() {
  let web3 = {toWei: ()=> {}};
  let ethbetInstance;
  let getWeb3Stub, getDeployedInstanceStub;

  before(function beforeTest() {
    getWeb3Stub = sinon.stub(web3Service, 'getWeb3');
    getWeb3Stub.callsFake(function () {
      return web3;
    });

    ethbetInstance = {
      balanceOf: () => {
      },
      lockBalance: () => {
      },
      lockedBalanceOf: () => {
      },
      unlockBalance: () => {
      },
      executeBet: () => {
      },
    };

    getDeployedInstanceStub = sinon.stub(contractService, 'getDeployedInstance');
    getDeployedInstanceStub.callsFake(function (myWeb3, contractName) {
      expect(myWeb3).to.eq(web3);
      expect(contractName).to.eq("Ethbet");

      return Promise.resolve(ethbetInstance);
    });
  });

  describe('balanceOf', function () {
    let balance = 40;
    let userAddress = testAddress.public;
    let balanceOfStub;

    before(function beforeTest() {
      balanceOfStub = sinon.stub(ethbetInstance, 'balanceOf');
      balanceOfStub.callsFake(function (myUserAddress) {
        expect(myUserAddress).to.eq(userAddress);

        return Promise.resolve({toNumber: () => balance});
      });
    });

    it('ok', async function it() {
      let myBalance = await ethbetService.balanceOf(userAddress);

      expect(myBalance).to.equal(balance);
    });

    after(function afterTest() {
      balanceOfStub.restore();
    });
  });

  describe('lockedBalanceOf', function () {
    let lockedBalance = 50;
    let userAddress = testAddress.public;
    let lockedBalanceOfStub;

    before(function beforeTest() {
      lockedBalanceOfStub = sinon.stub(ethbetInstance, 'lockedBalanceOf');
      lockedBalanceOfStub.callsFake(function (myUserAddress) {
        expect(myUserAddress).to.eq(userAddress);

        return Promise.resolve({toNumber: () => lockedBalance});
      });
    });

    it('ok', async function it() {
      let myLockedBalance = await ethbetService.lockedBalanceOf(userAddress);

      expect(myLockedBalance).to.equal(lockedBalance);
    });

    after(function afterTest() {
      lockedBalanceOfStub.restore();
    });
  });

  describe('lockBalance', function () {
    let amount = 100;
    let results = {receipt: {status:"0x1"}};
    let userAddress = testAddress.public;
    let lockBalanceStub;

    before(function beforeTest() {
      lockBalanceStub = sinon.stub(ethbetInstance, 'lockBalance');
      lockBalanceStub.callsFake(function (myUserAddress, myAmount) {
        expect(myUserAddress).to.eq(userAddress);
        expect(myAmount).to.eq(amount);

        return Promise.resolve(results);
      });
    });

    it('ok', async function it() {
      let myResults = await ethbetService.lockBalance(userAddress, amount);

      expect(myResults).to.equal(results);
    });

    after(function afterTest() {
      lockBalanceStub.restore();
    });
  });

  after(function afterTest() {
    getWeb3Stub.restore();
    getDeployedInstanceStub.restore();
  });


  describe('unlockBalance', function () {
    let amount = 100;
    let results = {receipt: {status:"0x1"}};
    let userAddress = testAddress.public;
    let unlockBalanceStub;

    before(function beforeTest() {
      unlockBalanceStub = sinon.stub(ethbetInstance, 'unlockBalance');
      unlockBalanceStub.callsFake(function (myUserAddress, myAmount) {
        expect(myUserAddress).to.eq(userAddress);
        expect(myAmount).to.eq(amount);

        return Promise.resolve(results);
      });
    });

    it('ok', async function it() {
      let myResults = await ethbetService.unlockBalance(userAddress, amount);

      expect(myResults).to.equal(results);
    });

    after(function afterTest() {
      unlockBalanceStub.restore();
    });
  });

  after(function afterTest() {
    getWeb3Stub.restore();
    getDeployedInstanceStub.restore();
  });

  describe('executeBet', function () {
    let maker = "0x001", caller = "0x002", makerWon = true, amount = 200;
    let results = {receipt: {status:"0x1"}};
    let executeBetStub;

    before(function beforeTest() {
      executeBetStub = sinon.stub(ethbetInstance, 'executeBet');
      executeBetStub.callsFake(function (_maker, _caller, _makerWon, _amount) {
        expect(_maker).to.eq(maker);
        expect(_caller).to.eq(caller);
        expect(_makerWon).to.eq(makerWon);
        expect(_amount).to.eq(amount);

        return Promise.resolve(results);
      });
    });

    it('ok', async function it() {
      let myResults = await ethbetService.executeBet(maker, caller, makerWon, amount);

      expect(myResults).to.equal(results);
    });

    after(function afterTest() {
      executeBetStub.restore();
    });
  });

  after(function afterTest() {
    getWeb3Stub.restore();
    getDeployedInstanceStub.restore();
  });

});