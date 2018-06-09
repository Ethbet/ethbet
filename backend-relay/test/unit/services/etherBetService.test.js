const expect = require('chai').expect;
const sinon = require('sinon');
const _ = require('lodash');

let socketService = require('../../../lib/socketService');
let etherBetService = require('../../../lib/etherBetService');
let ethbetOraclizeService = require('../../../lib/blockchain/ethbetOraclizeService');
let userService = require('../../../lib/userService');
let diceService = require('../../../lib/diceService');
const testAddress = require('../../support/testAddress.json');

const EtherBetFactory = require('../../factories/etherBets').EtherBetFactory;

describe('etherBetService', function etherBetServiceTest() {

  describe('createBet', function () {
    let emitStub, balanceOfStub,ethBalanceOfStub, chargeFeeAndLockEthBalanceStub;
    let etherBetData = {
      amount: 1.03,
      edge: 1.55,
      user: testAddress.public,
    };

    context('sufficient balance', function context() {
      let results = {stub: 'results'};

      before(function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        emitStub.callsFake(function (event, data) {
          expect(event).to.eq("etherBetCreated");
          expect(data.amount).to.eq(etherBetData.amount);
        });

        ethBalanceOfStub = sinon.stub(ethbetOraclizeService, "ethBalanceOf");
        ethBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(2.5);
        });

        balanceOfStub = sinon.stub(ethbetOraclizeService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(500);
        });

        chargeFeeAndLockEthBalanceStub = sinon.stub(ethbetOraclizeService, "chargeFeeAndLockEthBalance");
        chargeFeeAndLockEthBalanceStub.callsFake(function (userAddress, amount) {
          expect(userAddress).to.eq(testAddress.public);
          expect(amount).to.eq(etherBetData.amount);

          return Promise.resolve(results);
        });
      });

      it('ok', async function it() {
        let etherBet = await etherBetService.createBet(etherBetData);

        let myEtherBet = await db.EtherBet.findById(etherBet.id);

        expect(myEtherBet.amount).to.equal(1.03);
        expect(myEtherBet.edge).to.equal(1.55);
        expect(myEtherBet.user).to.equal(testAddress.public);

        expect(emitStub.callCount).to.equal(1);
        expect(chargeFeeAndLockEthBalanceStub.callCount).to.equal(1);
      });

      after(function afterTest() {
        emitStub.restore();
        balanceOfStub.restore();
        ethBalanceOfStub.restore();
        chargeFeeAndLockEthBalanceStub.restore();
      });
    });

    context('insufficient ETH balance', function context() {
      before(function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");

        ethBalanceOfStub = sinon.stub(ethbetOraclizeService, "ethBalanceOf");
        ethBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(0.6);
        });
      });

      it('fails', async function it() {
        try {
          await etherBetService.createBet(etherBetData);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Insufficient ETH Balance for bet')
        }

        expect(emitStub.callCount).to.equal(0);

        let bets = await db.EtherBet.findAll({});
        expect(bets.length).to.eq(0);
      });

      after(function afterTest() {
        emitStub.restore();
        ethBalanceOfStub.restore();
      });
    });

    context('insufficient EBET balance', function context() {
      before(function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");

        ethBalanceOfStub = sinon.stub(ethbetOraclizeService, "ethBalanceOf");
        ethBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(2.5);
        });

        balanceOfStub = sinon.stub(ethbetOraclizeService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(100);
        });
      });

      it('fails', async function it() {
        try {
          await etherBetService.createBet(etherBetData);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Insufficient EBET Balance for bet')
        }

        expect(emitStub.callCount).to.equal(0);

        let bets = await db.EtherBet.findAll({});
        expect(bets.length).to.eq(0);
      });

      after(function afterTest() {
        emitStub.restore();
        ethBalanceOfStub.restore();
        balanceOfStub.restore();
      });
    });
  });

  describe('getActiveBets', function () {
    let etherBet_1, etherBet_2, etherBet_3;

    before(async function beforeTest() {
      etherBet_1 = await db.EtherBet.create(EtherBetFactory.build({}));
      etherBet_2 = await db.EtherBet.create(EtherBetFactory.build({cancelledAt: new Date()}));
      etherBet_3 = await db.EtherBet.create(EtherBetFactory.build({initializedAt: new Date()}));
    });

    it('ok', async function it() {
      let results = await etherBetService.getActiveBets();

      expect(results.count).to.equal(1);
      expect(results.etherBets.length).to.equal(1);
      expect(results.etherBets[0].id).to.equal(etherBet_1.id);
    });
  });

  describe('getExecutedBets', function () {
    let getUsernamesStub;
    let userAddress_1 = "0x04bd37D5393cD877f64ad36f1791ED09d847b981";
    let userAddress_2 = "0x04bd37D5393cD877f64ad36f1791ED09d847b982";
    let userAddress_3 = "0x04bd37D5393cD877f64ad36f1791ED09d847b983";
    let username_1 = "Mike";
    let username_2 = "John";
    let username_3 = "Bob";
    let etherBet_1, etherBet_2, etherBet_3, etherBet_4;

    before(async function beforeTest() {
      etherBet_1 = await db.EtherBet.create(EtherBetFactory.build({}));
      etherBet_2 = await db.EtherBet.create(EtherBetFactory.build({cancelledAt: new Date()}));
      etherBet_3 = await db.EtherBet.create(EtherBetFactory.build({
        user: userAddress_1,
        callerUser: userAddress_2,
        executedAt: new Date() - 60000
      }));
      etherBet_4 = await db.EtherBet.create(EtherBetFactory.build({
        user: userAddress_2,
        callerUser: userAddress_3,
        executedAt: new Date()
      }));

      getUsernamesStub = sinon.stub(userService, "getUsernames");
      getUsernamesStub.callsFake(function (userAddresses) {
        expect(_.clone(userAddresses).sort()).to.deep.eq([userAddress_1, userAddress_2, userAddress_3]);

        return {
          [userAddress_1]: username_1,
          [userAddress_2]: username_2,
          [userAddress_3]: username_3,
        }
      });
    });

    it('ok', async function it() {
      let executedEtherBets = await etherBetService.getExecutedBets();

      expect(executedEtherBets.length).to.equal(2);

      let executedEtherBet_1_JSON = executedEtherBets[0].toJSON();
      expect(executedEtherBet_1_JSON.id).to.equal(etherBet_4.id);
      expect(executedEtherBet_1_JSON.username).to.equal(username_2);
      expect(executedEtherBet_1_JSON.callerUsername).to.equal(username_3);

      let executedEtherBet_2_JSON = executedEtherBets[1].toJSON();
      expect(executedEtherBet_2_JSON.id).to.equal(etherBet_3.id);
      expect(executedEtherBet_2_JSON.username).to.equal(username_1);
      expect(executedEtherBet_2_JSON.callerUsername).to.equal(username_2);
    });

    after(function afterTest() {
      getUsernamesStub.restore();
    });
  });

  describe('cancelBet', function () {
    let emitStub, lockedEthBalanceOfStub, unlockEthBalanceStub;
    let etherBetData = {
      amount: 0.8,
      edge: 1.5,
      user: testAddress.public,
    };
    let etherBet;

    context('insufficient locked eth balance', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");

        lockedEthBalanceOfStub = sinon.stub(ethbetOraclizeService, "lockedEthBalanceOf");
        lockedEthBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(etherBetData.amount / 2);
        });

        etherBet = await db.EtherBet.create(etherBetData);
      });

      it('fails', async function it() {
        try {
          await etherBetService.cancelBet(etherBet.id, testAddress.public);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Locked Eth Balance is less than bet amount')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockEthBalanceStub.callCount).to.equal(0);

        let updatedEtherBet = await db.EtherBet.findById(etherBet.id);
        expect(updatedEtherBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockEthBalanceStub.restore();
        lockedEthBalanceOfStub.restore();
      });
    });

    context('ether bet does not exist', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");

        etherBet = await db.EtherBet.create(etherBetData);
      });

      it('fails', async function it() {
        try {
          await etherBetService.cancelBet(etherBet.id + 100, testAddress.public);

          throw new Error("Ether Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Ether Bet not found')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockEthBalanceStub.callCount).to.equal(0);

        let updatedEtherBet = await db.EtherBet.findById(etherBet.id);
        expect(updatedEtherBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockEthBalanceStub.restore();
      });
    });

    context('ether bet already canceled', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");

        etherBet = await db.EtherBet.create(Object.assign({}, etherBetData, {cancelledAt: new Date()}));
      });

      it('fails', async function it() {
        try {
          await etherBetService.cancelBet(etherBet.id, testAddress.public);

          throw new Error("Ether Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Ether Bet already cancelled')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockEthBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.EtherBet.findById(etherBet.id);
        expect(!!updatedBet.cancelledAt).to.eq(true);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockEthBalanceStub.restore();
      });
    });

    context('bet already initialized', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");

        etherBet = await db.EtherBet.create(Object.assign({}, etherBetData, {initializedAt: new Date()}));
      });

      it('fails', async function it() {
        try {
          await etherBetService.cancelBet(etherBet.id, testAddress.public);

          throw new Error("Ether Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Ether Bet already called, execution in progress')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockEthBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.EtherBet.findById(etherBet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockEthBalanceStub.restore();
      });
    });
    
    context('bet already executed', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");

        etherBet = await db.EtherBet.create(Object.assign({}, etherBetData, {executedAt: new Date()}));
      });

      it('fails', async function it() {
        try {
          await etherBetService.cancelBet(etherBet.id, testAddress.public);

          throw new Error("Ether Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Ether Bet already executed')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockEthBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.EtherBet.findById(etherBet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockEthBalanceStub.restore();
      });
    });

    context("can't cancel someone else's bet", function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");

        etherBet = await db.EtherBet.create(Object.assign({}, etherBetData, {user: "0x12f7c4c8977a5b9addb52b83e23c9d0f3b89be16"}));
      });

      it('fails', async function it() {
        try {
          await etherBetService.cancelBet(etherBet.id, testAddress.public);

          throw new Error("Ether Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq("You can't cancel someone else's bet")
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockEthBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.EtherBet.findById(etherBet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockEthBalanceStub.restore();
      });
    });

    context('sufficient locked balance', function context() {
      let results = {stub: 'results'};

      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        emitStub.callsFake(function (event, data) {
          expect(event).to.eq("etherBetCanceled");
          expect(data.amount).to.eq(etherBetData.amount);
        });

        lockedEthBalanceOfStub = sinon.stub(ethbetOraclizeService, "lockedEthBalanceOf");
        lockedEthBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(etherBetData.amount * 2);
        });

        unlockEthBalanceStub = sinon.stub(ethbetOraclizeService, "unlockEthBalance");
        unlockEthBalanceStub.callsFake(function (userAddress, amount) {
          expect(userAddress).to.eq(testAddress.public);
          expect(amount).to.eq(etherBetData.amount);

          return Promise.resolve(results);
        });

        etherBet = await db.EtherBet.create(etherBetData);
      });

      it('ok', async function it() {
        await etherBetService.cancelBet(etherBet.id, testAddress.public);

        let updatedBet = await db.EtherBet.findById(etherBet.id);
        expect(!!updatedBet.cancelledAt).to.equal(true);

        expect(emitStub.callCount).to.equal(1);
        expect(unlockEthBalanceStub.callCount).to.equal(1);
      });

      after(function afterTest() {
        emitStub.restore();
        lockedEthBalanceOfStub.restore();
        unlockEthBalanceStub.restore();
      });
    });
  });


});

