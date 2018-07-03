const expect = require('chai').expect;
const sinon = require('sinon');

let ethbetOraclizeService = require('../../../../lib/blockchain/ethbetOraclizeService');
const contractService = require('../../../../lib/contractService');
const web3Service = require('../../../../lib/web3Service');

const testAddress = require('../../../support/testAddress.json');


describe('ethbetOraclizeService', function ethbetOraclizeServiceTest() {
  let web3 = {
    toWei: (amount, unit) => {
      if (unit === "ether") {
        return amount * (10 ** 18);
      }
    },
    fromWei: (amount, unit) => {
      if (unit === "ether") {
        return amount / (10 ** 18);
      }
    }
  };
  let ethbetOraclizeInstance;
  let getWeb3Stub, getDeployedInstanceStub;

  before(function beforeTest() {
    getWeb3Stub = sinon.stub(web3Service, 'getWeb3');
    getWeb3Stub.callsFake(function () {
      return web3;
    });

    ethbetOraclizeInstance = {
      balanceOf: () => {
      },
      ethBalanceOf: () => {
      },
      lockedEthBalanceOf: () => {
      },
      isBetInitialized: () => {
      },
      chargeFeeAndLockEthBalance: () => {
      },
      unlockEthBalance: () => {
      },
      oraclizeGasPrice: () => {
      },
      oraclizeGasLimit: () => {
      },
      initBet: () => {
      },
      getBetById: () => {
      },
    };

    getDeployedInstanceStub = sinon.stub(contractService, 'getDeployedInstance');
    getDeployedInstanceStub.callsFake(function (myWeb3, contractName) {
      expect(myWeb3).to.eq(web3);
      expect(contractName).to.eq("EthbetOraclize");

      return Promise.resolve(ethbetOraclizeInstance);
    });
  });

  describe('balanceOf', function () {
    let balance = 40;
    let userAddress = testAddress.public;
    let balanceOfStub;

    before(function beforeTest() {
      balanceOfStub = sinon.stub(ethbetOraclizeInstance, 'balanceOf');
      balanceOfStub.callsFake(function (myUserAddress) {
        expect(myUserAddress).to.eq(userAddress);

        return Promise.resolve({ toNumber: () => balance });
      });
    });

    it('ok', async function it() {
      let myBalance = await ethbetOraclizeService.balanceOf(userAddress);

      expect(myBalance).to.equal(balance);
    });

    after(function afterTest() {
      balanceOfStub.restore();
    });
  });

  describe('ethBalanceOf', function () {
    let ethBalance = 1.8 * 10 ** 18; // 1.8 ether;
    let userAddress = testAddress.public;
    let ethBalanceOfStub;

    before(function beforeTest() {
      ethBalanceOfStub = sinon.stub(ethbetOraclizeInstance, 'ethBalanceOf');
      ethBalanceOfStub.callsFake(function (myUserAddress) {
        expect(myUserAddress).to.eq(userAddress);

        return Promise.resolve({ toNumber: () => ethBalance });
      });
    });

    it('ok', async function it() {
      let myBalance = await ethbetOraclizeService.ethBalanceOf(userAddress);

      expect(myBalance).to.equal(1.8);
    });

    after(function afterTest() {
      ethBalanceOfStub.restore();
    });
  });

  describe('lockedEthBalanceOf', function () {
    let lockedEthBalance = 0.5 * 10 ** 18; // 0.5 ether
    let userAddress = testAddress.public;
    let lockedEthBalanceOfStub;

    before(function beforeTest() {
      lockedEthBalanceOfStub = sinon.stub(ethbetOraclizeInstance, 'lockedEthBalanceOf');
      lockedEthBalanceOfStub.callsFake(function (myUserAddress) {
        expect(myUserAddress).to.eq(userAddress);

        return Promise.resolve({ toNumber: () => lockedEthBalance });
      });
    });

    it('ok', async function it() {
      let myLockedBalance = await ethbetOraclizeService.lockedEthBalanceOf(userAddress);

      expect(myLockedBalance).to.equal(0.5);
    });

    after(function afterTest() {
      lockedEthBalanceOfStub.restore();
    });
  });

  describe('isBetInitialized', function () {
    let betId = 55;
    let isBetInitializedStub;

    before(function beforeTest() {
      isBetInitializedStub = sinon.stub(ethbetOraclizeInstance, 'isBetInitialized');
      isBetInitializedStub.callsFake(function (myBetId) {
        expect(myBetId).to.eq(betId);

        return Promise.resolve(true);
      });
    });

    it('ok', async function it() {
      let intialized = await ethbetOraclizeService.isBetInitialized(betId);

      expect(intialized).to.equal(true);
    });

    after(function afterTest() {
      isBetInitializedStub.restore();
    });
  });

  describe('chargeFeeAndLockEthBalance', function () {
    let amount = 1.2;
    let results = { receipt: { status: "0x1" } };
    let userAddress = testAddress.public;
    let chargeFeeAndLockEthBalanceStub;

    before(function beforeTest() {
      chargeFeeAndLockEthBalanceStub = sinon.stub(ethbetOraclizeInstance, 'chargeFeeAndLockEthBalance');
      chargeFeeAndLockEthBalanceStub.callsFake(function (myUserAddress, myAmount) {
        expect(myUserAddress).to.eq(userAddress);
        expect(myAmount).to.eq(1.2 * 10 ** 18);

        return Promise.resolve(results);
      });
    });

    it('ok', async function it() {
      let myResults = await ethbetOraclizeService.chargeFeeAndLockEthBalance(userAddress, amount);

      expect(myResults).to.equal(results);
    });

    after(function afterTest() {
      chargeFeeAndLockEthBalanceStub.restore();
    });
  });

  describe('unlockEthBalance', function () {
    let amount = 1.2;
    let results = { receipt: { status: "0x1" } };
    let userAddress = testAddress.public;
    let unlockEthBalanceStub;

    before(function beforeTest() {
      unlockEthBalanceStub = sinon.stub(ethbetOraclizeInstance, 'unlockEthBalance');
      unlockEthBalanceStub.callsFake(function (myUserAddress, myAmount) {
        expect(myUserAddress).to.eq(userAddress);
        expect(myAmount).to.eq(1.2 * 10 ** 18);

        return Promise.resolve(results);
      });
    });

    it('ok', async function it() {
      let myResults = await ethbetOraclizeService.unlockEthBalance(userAddress, amount);

      expect(myResults).to.equal(results);
    });

    after(function afterTest() {
      unlockEthBalanceStub.restore();
    });
  });

  describe('initBet', function () {
    let betId = 47;
    let maker = "0x00000001";
    let caller = "0x00000002";
    let amount = 1.2;
    let rollUnder = 53.5;
    let results = { receipt: { status: "0x1" } };
    let oraclizeGasPrice = 10 * 10 ** 9;
    let oraclizeGasLimit = 250000;
    let initBetStub, oraclizeGasPriceStub, oraclizeGasLimitStub;

    before(function beforeTest() {
      balanceOfStub = sinon.stub(ethbetOraclizeInstance, 'oraclizeGasPrice');
      balanceOfStub.callsFake(function () {
        return Promise.resolve({ toNumber: () => oraclizeGasPrice });
      });

      oraclizeGasLimitStub = sinon.stub(ethbetOraclizeInstance, 'oraclizeGasLimit');
      oraclizeGasLimitStub.callsFake(function () {
        return Promise.resolve({ toNumber: () => oraclizeGasLimit });
      });

      initBetStub = sinon.stub(ethbetOraclizeInstance, 'initBet');
      initBetStub.callsFake(function (myBetId, myMaker, myCaller, myAmount, myRollUnder, params) {
        expect(myBetId).to.eq(betId);
        expect(myMaker).to.eq(maker);
        expect(myCaller).to.eq(caller);
        expect(myAmount).to.eq(1.2 * 10 ** 18);
        expect(myRollUnder).to.eq(5350);
        expect(params).to.deep.eq({
          gas: 200000,
          value: 2560000000000000
        });

        return Promise.resolve(results);
      });
    });

    it('ok', async function it() {
      let myResults = await ethbetOraclizeService.initBet(betId, maker, caller, amount, rollUnder);

      expect(myResults).to.equal(results);
    });

    after(function afterTest() {
      balanceOfStub.restore();
      oraclizeGasLimitStub.restore();
      initBetStub.restore();
    });
  });

  after(function afterTest() {
    getWeb3Stub.restore();
    getDeployedInstanceStub.restore();
  });

  describe('getBetById', function () {
    let betId = 55;
    let getBetByIdStub;

    before(function beforeTest() {
      getBetByIdStub = sinon.stub(ethbetOraclizeInstance, 'getBetById');
      getBetByIdStub.callsFake(function (myBetId) {
        expect(myBetId).to.eq(betId);

        return Promise.resolve([
          "0x001",
          "0x002",
          { toNumber: () => 1.5 * 10 ** 18 },
          { toNumber: () => 5310 },
          "du",
          { toNumber: () => 4723 },
          true,
          { toNumber: () => 1518620592549 },
        ]);
      });
    });

    it('ok', async function it() {
      let contractEtherBet = await ethbetOraclizeService.getBetById(betId);

      expect(contractEtherBet).to.deep.equal({
        "amount": 1.5,
        "caller": "0x002",
        "executedAt": new Date(1518620592549),
        "maker": "0x001",
        "makerWon": true,
        "rawResult": "du",
        "roll": 47.23,
        "rollUnder": 53.1,
      });
    });

    after(function afterTest() {
      getBetByIdStub.restore();
    });
  });

});