const expect = require('chai').expect;
const sinon = require('sinon');
const _ = require('lodash');

let socketService = require('../../../lib/socketService');
let betService = require('../../../lib/betService');
let ethbetService = require('../../../lib/ethbetService');
let userService = require('../../../lib/userService');
let diceService = require('../../../lib/diceService');
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
      let results = await betService.getActiveBets();

      expect(results.count).to.equal(1);
      expect(results.bets.length).to.equal(1);
      expect(results.bets[0].id).to.equal(bet_1.id);
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
    let bet_1, bet_2, bet_3, bet_4;

    before(async function beforeTest() {
      bet_1 = await db.Bet.create(BetFactory.build({}));
      bet_2 = await db.Bet.create(BetFactory.build({cancelledAt: new Date()}));
      bet_3 = await db.Bet.create(BetFactory.build({
        user: userAddress_1,
        callerUser: userAddress_2,
        executedAt: new Date() - 60000
      }));
      bet_4 = await db.Bet.create(BetFactory.build({
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
      let executedBets = await betService.getExecutedBets();

      expect(executedBets.length).to.equal(2);

      let executedBet_1_JSON = executedBets[0].toJSON();
      expect(executedBet_1_JSON.id).to.equal(bet_4.id);
      expect(executedBet_1_JSON.username).to.equal(username_2);
      expect(executedBet_1_JSON.callerUsername).to.equal(username_3);

      let executedBet_2_JSON = executedBets[1].toJSON();
      expect(executedBet_2_JSON.id).to.equal(bet_3.id);
      expect(executedBet_2_JSON.username).to.equal(username_1);
      expect(executedBet_2_JSON.callerUsername).to.equal(username_2);
    });

    after(function afterTest() {
      getUsernamesStub.restore();
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


  describe('callBet', function () {
    let emitStub, balanceOfStub, lockedBalanceOfStub, executeBetStub, calculateRollStub;
    let callerUser = "0x05ad37D5393cD877f64ad36f1791ED09d847b123";
    let callerSeed = "callerAbcde12345";
    let betData = {
      amount: 600,
      edge: 8,
      user: testAddress.public,
      seed: "123456abcd123456"
    };
    let bet;

    context('bet does not exist', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        executeBetStub = sinon.stub(ethbetService, "executeBet");

        bet = await db.Bet.create(betData);
      });

      it('fails', async function it() {
        try {
          await betService.callBet(bet.id + 100, callerSeed, callerUser);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Bet not found')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(executeBetStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.executedAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        executeBetStub.restore();
      });
    });

    context('bet canceled', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        executeBetStub = sinon.stub(ethbetService, "executeBet");

        bet = await db.Bet.create(Object.assign({}, betData, {cancelledAt: new Date()}));
      });

      it('fails', async function it() {
        try {
          await betService.callBet(bet.id, callerSeed, callerUser);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Bet cancelled')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(executeBetStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.executedAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        executeBetStub.restore();
      });
    });


    context('bet already executed', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        executeBetStub = sinon.stub(ethbetService, "executeBet");

        bet = await db.Bet.create(Object.assign({}, betData, {executedAt: new Date(2017, 3, 4)}));
      });

      it('fails', async function it() {
        try {
          await betService.callBet(bet.id, callerSeed, callerUser);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Bet already called')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(executeBetStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(!!updatedBet.executedAt).to.eq(true);
      });

      after(function afterTest() {
        emitStub.restore();
        executeBetStub.restore();
      });
    });

    context('own bet', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        executeBetStub = sinon.stub(ethbetService, "executeBet");

        bet = await db.Bet.create(betData);
      });

      it('fails', async function it() {
        try {
          await betService.callBet(bet.id, callerSeed, betData.user);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('You can\'t call your own bet')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(executeBetStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.executedAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        executeBetStub.restore();
      });
    });

    context('insufficient balance', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        executeBetStub = sinon.stub(ethbetService, "executeBet");

        balanceOfStub = sinon.stub(ethbetService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(callerUser);

          return Promise.resolve(betData.amount / 2);
        });

        bet = await db.Bet.create(betData);
      });

      it('fails', async function it() {
        try {
          await betService.callBet(bet.id, callerSeed, callerUser);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Insufficient Balance for bet')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(executeBetStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.executedAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        executeBetStub.restore();
        balanceOfStub.restore();
      });
    });

    context('insufficient maker locked balance', function context() {
      before(async function beforeTest() {
        emitStub = sinon.stub(socketService, "emit");
        executeBetStub = sinon.stub(ethbetService, "executeBet");

        balanceOfStub = sinon.stub(ethbetService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(callerUser);

          return Promise.resolve(betData.amount);
        });

        lockedBalanceOfStub = sinon.stub(ethbetService, "lockedBalanceOf");
        lockedBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(betData.user);

          return Promise.resolve(betData.amount / 2);
        });

        bet = await db.Bet.create(betData);
      });

      it('fails', async function it() {
        try {
          await betService.callBet(bet.id, callerSeed, callerUser);

          throw new Error("Bet Creation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Maker user Locked Balance is less than bet amount')
        }

        expect(emitStub.callCount).to.equal(0);
        expect(executeBetStub.callCount).to.equal(0);

        let updatedBet = await db.Bet.findById(bet.id);
        expect(updatedBet.executedAt).to.eq(null);
      });

      after(function afterTest() {
        emitStub.restore();
        executeBetStub.restore();
        balanceOfStub.restore();
        lockedBalanceOfStub.restore();
      });
    });

    context('conditions ok', function context() {
      let txResults = {tx: '9651asdcxvfads'};

      before(function beforeTest() {
        balanceOfStub = sinon.stub(ethbetService, "balanceOf");
        balanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(callerUser);

          return Promise.resolve(betData.amount);
        });

        lockedBalanceOfStub = sinon.stub(ethbetService, "lockedBalanceOf");
        lockedBalanceOfStub.callsFake(function (userAddress) {
          expect(userAddress).to.eq(betData.user);

          return Promise.resolve(betData.amount);
        });
      });

      describe('maker won', function describe() {
        let rollResults = {
          "executedAt": new Date("2017-05-31T11:54:44.000Z"),
          "fullSeed": "fullseed",
          "roll": 53.9,
          "serverSeed": "serverseed123456"
        };

        before(async function beforeTest() {
          bet = await db.Bet.create(betData);

          calculateRollStub = sinon.stub(diceService, "calculateRoll");
          calculateRollStub.callsFake(function (rollInput) {
            expect(rollInput).to.deep.eq({
              makerSeed: betData.seed,
              callerSeed: callerSeed,
              betId: bet.id,
            });

            return rollResults;
          });

          emitStub = sinon.stub(socketService, "emit");
          emitStub.callsFake(function (event, data) {
            expect(event).to.eq("betCalled");
            expect(data.id).to.eq(bet.id);
          });

          executeBetStub = sinon.stub(ethbetService, "executeBet");
          executeBetStub.callsFake(function (maker, caller, makerWon, amount) {
            expect(maker).to.eq(testAddress.public);
            expect(caller).to.eq(callerUser);
            expect(makerWon).to.eq(true);
            expect(amount).to.eq(betData.amount);

            return Promise.resolve(txResults);
          });
        });

        it('ok', async function it() {
          let results = await betService.callBet(bet.id, callerSeed, callerUser);

          expect(results).to.deep.equal({
            tx: txResults.tx,
            resultMessage: "You rolled a 53.9 (needed 54) and lost 6 EBET!'",
            seedMessage: "We combined the makerSeed (123456abcd123456), the callerSeed (callerAbcde12345) and the server seed (serverseed123456), and the betID (1) in order to produce the fullSeed: fullseed"
          });

          let updatedBet = await db.Bet.findById(bet.id);
          expect(updatedBet.executedAt.toISOString()).to.equal(rollResults.executedAt.toISOString());
          expect(updatedBet.callerUser).to.equal(callerUser);
          expect(updatedBet.serverSeed).to.equal(rollResults.serverSeed);
          expect(updatedBet.fullSeed).to.equal(rollResults.fullSeed);
          expect(updatedBet.roll).to.equal(rollResults.roll);
          expect(updatedBet.makerWon).to.equal(true);

          expect(emitStub.callCount).to.equal(1);
          expect(executeBetStub.callCount).to.equal(1);
        });

        after(function afterTest() {
          emitStub.restore();
          executeBetStub.restore();
          calculateRollStub.restore();
        });
      });

      describe('maker lost', function describe() {
        let rollResults = {
          "executedAt": new Date("2017-05-31T11:54:44.000Z"),
          "fullSeed": "fullseed",
          "roll": 54.1,
          "serverSeed": "serverseed123456"
        };

        before(async function beforeTest() {
          bet = await db.Bet.create(betData);

          calculateRollStub = sinon.stub(diceService, "calculateRoll");
          calculateRollStub.callsFake(function (rollInput) {
            expect(rollInput).to.deep.eq({
              makerSeed: betData.seed,
              callerSeed: callerSeed,
              betId: bet.id,
            });

            return rollResults;
          });

          emitStub = sinon.stub(socketService, "emit");
          emitStub.callsFake(function (event, data) {
            expect(event).to.eq("betCalled");
            expect(data.id).to.eq(bet.id);
          });

          executeBetStub = sinon.stub(ethbetService, "executeBet");
          executeBetStub.callsFake(function (maker, caller, makerWon, amount) {
            expect(maker).to.eq(testAddress.public);
            expect(caller).to.eq(callerUser);
            expect(makerWon).to.eq(false);
            expect(amount).to.eq(betData.amount);

            return Promise.resolve(txResults);
          });
        });

        it('ok', async function it() {
          let results = await betService.callBet(bet.id, callerSeed, callerUser);

          expect(results).to.deep.equal({
            tx: txResults.tx,
            resultMessage: "You rolled a 54.1 (needed 54) and won 6 EBET!'",
            seedMessage: "We combined the makerSeed (123456abcd123456), the callerSeed (callerAbcde12345) and the server seed (serverseed123456), and the betID (1) in order to produce the fullSeed: fullseed"
          });

          let updatedBet = await db.Bet.findById(bet.id);
          expect(updatedBet.executedAt.toISOString()).to.equal(rollResults.executedAt.toISOString());
          expect(updatedBet.callerUser).to.equal(callerUser);
          expect(updatedBet.serverSeed).to.equal(rollResults.serverSeed);
          expect(updatedBet.fullSeed).to.equal(rollResults.fullSeed);
          expect(updatedBet.roll).to.equal(rollResults.roll);
          expect(updatedBet.makerWon).to.equal(false);

          expect(emitStub.callCount).to.equal(1);
          expect(executeBetStub.callCount).to.equal(1);
        });

        after(function afterTest() {
          emitStub.restore();
          executeBetStub.restore();
          calculateRollStub.restore();
        });
      });


      after(function afterTest() {
        balanceOfStub.restore();
        lockedBalanceOfStub.restore();
      });

    });
  });


});

