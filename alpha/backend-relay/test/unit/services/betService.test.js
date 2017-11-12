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

      it('ok', async function it() {
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
});
