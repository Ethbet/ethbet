const expect = require('chai').expect;
const sinon = require('sinon');

let socketService = require('../../../lib/socketService');
let betService = require('../../../lib/betService');
let ethbetService = require('../../../lib/ethbetService');
const testAddress = require('../../support/testAddress.json');

const BetFactory = require('../../factories/bets').BetFactory;

describe('betService', function betServiceTest() {

  describe('createBet', function () {
    let emitStub, balanceOfStub, lockBalanceStub;
    let betData = {
      amount: 500,
      edge: 1.5,
      user: testAddress.public,
      seed: "123456abcd123456"
    };

    context('sufficient balance', function context() {
      let results = {stub: 'results'};

      before(function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        emitStub.callsFake(function (event, data) {
          expect(event).to.eq("betCreated");
          expect(data.amount).to.eq(betData.amount);
        });

        balanceOfStub = sinon.stub(ethbetService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(betData.amount * 2);
        });

        lockBalanceStub = sinon.stub(ethbetService, "lockBalance");
        lockBalanceStub.callsFake(function (userAddress, amount) {
          expect(userAddress).to.eq(testAddress.public);
          expect(amount).to.eq(betData.amount);

          return Promise.resolve(results);
        });
      });

      it('ok', async function it() {
        let bet = await betService.createBet(betData);

        let myBet = await db.Bet.findById(bet.id);

        expect(myBet.amount).to.equal(500);
        expect(myBet.edge).to.equal(1.5);
        expect(myBet.user).to.equal(testAddress.public);
        expect(myBet.seed).to.equal("123456abcd123456");

        expect(emitStub.callCount).to.equal(1);
        expect(lockBalanceStub.callCount).to.equal(1);
      });

      after(function afterTest() {
        emitStub.restore();
        balanceOfStub.restore();
        lockBalanceStub.restore();
      });
    });

    context('insufficient balance', function context() {
      before(function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");

        balanceOfStub = sinon.stub(ethbetService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(betData.amount / 2);
        });
      });

      it('fails', async function it() {
        try {
          await betService.createBet(betData);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Insufficient Balance for bet')
        }

        expect(emitStub.callCount).to.equal(0);

        let bets = await db.Bet.findAll({});
        expect(bets.length).to.eq(0);
      });

      after(function afterTest() {
        emitStub.restore();
        balanceOfStub.restore();
      });
    });

  });


  describe('getActiveBets', function () {
    let bet_1, bet_2, bet_3;

    before(async function beforeTest() {
      bet_1 = await db.Bet.create(BetFactory.build({}));
      bet_2 = await db.Bet.create(BetFactory.build({cancelledAt: new Date()}));
      bet_3 = await db.Bet.create(BetFactory.build({executedAt: new Date()}));
    });

    it('ok', async function it() {
      let activeBets = await betService.getActiveBets();

      expect(activeBets.length).to.equal(1);
      expect(activeBets[0].id).to.equal(bet_1.id);
    });
  });


  describe('cancelBet', function () {
    let emitStub, lockedBalanceOfStub, unlockBalanceStub;
    let betData = {
      amount: 500,
      edge: 1.5,
      user: testAddress.public,
      seed: "123456abcd123456"
    };
    let bet;

    context('insufficient locked balance', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockBalanceStub = sinon.stub(ethbetService, "unlockBalance");

        lockedBalanceOfStub = sinon.stub(ethbetService, "lockedBalanceOf");
        lockedBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(betData.amount / 2);
        });

        bet = await db.Bet.create(betData);
      });

      it('fails', async function it() {
        try {
          await betService.cancelBet(bet.id, testAddress.public);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Locked Balance is less than bet amount')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockBalanceStub.restore();
        lockedBalanceOfStub.restore();
      });
    });

    context('bet does not exist', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockBalanceStub = sinon.stub(ethbetService, "unlockBalance");

        bet = await db.Bet.create(betData);
      });

      it('fails', async function it() {
        try {
          await betService.cancelBet(bet.id + 100, testAddress.public);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Bet not found')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockBalanceStub.restore();
      });
    });

    context('bet already canceled', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockBalanceStub = sinon.stub(ethbetService, "unlockBalance");

        bet = await db.Bet.create(Object.assign({}, betData, {cancelledAt: new Date()}));
      });

      it('fails', async function it() {
        try {
          await betService.cancelBet(bet.id, testAddress.public);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Bet already cancelled')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(!!updatedBet.cancelledAt).to.eq(true);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockBalanceStub.restore();
      });
    });

    context('bet already called', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockBalanceStub = sinon.stub(ethbetService, "unlockBalance");

        bet = await db.Bet.create(Object.assign({}, betData, {executedAt: new Date()}));
      });

      it('fails', async function it() {
        try {
          await betService.cancelBet(bet.id, testAddress.public);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Bet already called')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockBalanceStub.restore();
      });
    });

    context("can't cancel someone else's bet", function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        unlockBalanceStub = sinon.stub(ethbetService, "unlockBalance");

        bet = await db.Bet.create(Object.assign({}, betData, {user: "0x12f7c4c8977a5b9addb52b83e23c9d0f3b89be16"}));
      });

      it('fails', async function it() {
        try {
          await betService.cancelBet(bet.id, testAddress.public);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq("You can't cancel someone else's bet")
        }

        expect(emitStub.callCount).to.equal(0);
        expect(unlockBalanceStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.cancelledAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        unlockBalanceStub.restore();
      });
    });

    context('sufficient locked balance', function context() {
      let results = {stub: 'results'};

      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        emitStub.callsFake(function (event, data) {
          expect(event).to.eq("betCanceled");
          expect(data.amount).to.eq(betData.amount);
        });

        lockedBalanceOfStub = sinon.stub(ethbetService, "lockedBalanceOf");
        lockedBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(testAddress.public);

          return Promise.resolve(betData.amount * 2);
        });

        unlockBalanceStub = sinon.stub(ethbetService, "unlockBalance");
        unlockBalanceStub.callsFake(function (userAddress, amount) {
          expect(userAddress).to.eq(testAddress.public);
          expect(amount).to.eq(betData.amount);

          return Promise.resolve(results);
        });

        bet = await db.Bet.create(betData);
      });

      it('ok', async function it() {
        await betService.cancelBet(bet.id, testAddress.public);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(!!updatedBet.cancelledAt).to.equal(true);

        expect(emitStub.callCount).to.equal(1);
        expect(unlockBalanceStub.callCount).to.equal(1);
      });

      after(function afterTest() {
        emitStub.restore();
        lockedBalanceOfStub.restore();
        unlockBalanceStub.restore();
      });
    });


  });


});

