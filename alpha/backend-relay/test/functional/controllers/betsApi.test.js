const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../../server').app;
const signService = require('../../support/signService');
const testAddress = require('../../support/testAddress.json');

const betService = require('../../../lib/betService');

describe('betsApi', function betsApiTest() {

  describe('getActiveBets', function getActiveBetsTest() {
    let getActiveBetsStub;
    let results = { stub: "results" };

    before(function beforeTest() {
      getActiveBetsStub = sinon.stub(betService, "getActiveBets");
      getActiveBetsStub.callsFake(function (opts) {
        expect(opts).to.deep.eq({
          orderField: 'createdAt',
          orderDirection: 'DESC',
          offset: 10
        });

        return Promise.resolve(results);
      });
    });

    it('ok', function it(done) {
      request(app)
        .get(`/api/bets/active?orderField=createdAt&orderDirection=DESC&offset=10`)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.results).to.deep.eq(results);
          done();
        });
    });

    after(function afterTest() {
      getActiveBetsStub.restore();
    });
  });

  describe('getExecutedBets', function getExecutedBetsTest() {
    let getExecutedBetsStub;
    let executedBets = [{ stub: "executedBet" }];

    before(function beforeTest() {
      getExecutedBetsStub = sinon.stub(betService, "getExecutedBets");
      getExecutedBetsStub.resolves(executedBets);
    });

    it('ok', function it(done) {
      request(app)
        .get('/api/bets/executed')
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.bets).to.deep.eq(executedBets);
          done();
        });
    });

    after(function afterTest() {
      getExecutedBetsStub.restore();
    });
  });

  describe('getBetInfo', function getBetInfoTest() {
    let getBetInfoStub;
    let bet = { id: 44 };

    before(function beforeTest() {
      getBetInfoStub = sinon.stub(betService, "getBetInfo");
      getBetInfoStub.resolves(bet);
    });

    it('ok', function it(done) {
      request(app)
        .get('/api/bets/' + bet.id)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body).to.deep.eq(bet);
          done();
        });
    });

    after(function afterTest() {
      getBetInfoStub.restore();
    });
  });

  describe('createBet', function createBetTest() {
    let createBetStub;
    let bet = { stub: "bet" };
    let betData = {
      amount: 100,
      edge: 1,
      seed: "123456123456abcd",
      gasPriceType: "high"
    };
    let message;

    before(function beforeTest() {
      createBetStub = sinon.stub(betService, "createBet");
      createBetStub.callsFake(function (myBetData) {
        expect(myBetData).to.deep.eq({
          amount: betData.amount,
          edge: betData.edge,
          seed: betData.seed,
          gasPriceType: betData.gasPriceType,
          user: testAddress.public
        });

        return Promise.resolve();
      });

      message = signService.buildMessage(betData, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/api/bets')
        .send(message)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          done();
        });
    });

    after(function afterTest() {
      createBetStub.restore();
    });
  });

  describe('cancelBet', function cancelBetTest() {
    let cancelBetStub;
    let data = {
      id: 36,
      gasPriceType: "low"
    };
    let message;

    before(function beforeTest() {
      cancelBetStub = sinon.stub(betService, "cancelBet");
      cancelBetStub.callsFake(function (betId, myAddress, myGasPriceType) {
        expect(betId).to.eq(data.id);
        expect(myAddress).to.eq(testAddress.public);
        expect(myGasPriceType).to.eq(data.gasPriceType);

        return Promise.resolve();
      });

      message = signService.buildMessage(data, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/api/bets/cancel')
        .send(message)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          done();
        });
    });

    after(function afterTest() {
      cancelBetStub.restore();
    });
  });

  describe('callBet', function callBetTest() {
    let callBetStub;
    let data = {
      id: 36,
      seed: "1111222233334444",
      gasPriceType: "low"
    };
    let message;

    before(function beforeTest() {
      callBetStub = sinon.stub(betService, "callBet");
      callBetStub.callsFake(function (betId, seed, myAddress, myGasPriceType) {
        expect(betId).to.eq(data.id);
        expect(seed).to.eq(data.seed);
        expect(myAddress).to.eq(testAddress.public);
        expect(myGasPriceType).to.eq(data.gasPriceType);

        return Promise.resolve();
      });

      message = signService.buildMessage(data, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/api/bets/call')
        .send(message)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          done();
        });
    });

    after(function afterTest() {
      callBetStub.restore();
    });
  });

});