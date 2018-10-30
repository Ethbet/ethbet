const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../../server').app;
const signService = require('../../support/signService');
const testAddress = require('../../support/testAddress.json');

const etherBetService = require('../../../lib/etherBetService');

describe('etherBetsApi', function etherBetsApiTest() {

  describe('getActiveBets', function getActiveBetsTest() {
    let getActiveBetsStub;
    let results = {stub: "results"};

    before(function beforeTest() {
      getActiveBetsStub = sinon.stub(etherBetService, "getActiveBets");
      getActiveBetsStub.callsFake(function (opts) {
        expect(opts).to.deep.eq({
          orderField: 'createdAt',
          orderDirection: 'DESC',
          offset:10
        });

        return Promise.resolve(results);
      });
    });

    it('ok', function it(done) {
      request(app)
        .get(`/api/ether-bets/active?orderField=createdAt&orderDirection=DESC&offset=10`)
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
    let executedEtherBets = [{stub: "executedBet"}];

    before(function beforeTest() {
      getExecutedBetsStub = sinon.stub(etherBetService, "getExecutedBets");
      getExecutedBetsStub.resolves(executedEtherBets);
    });

    it('ok', function it(done) {
      request(app)
        .get('/api/ether-bets/executed')
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.bets).to.deep.eq(executedEtherBets);
          done();
        });
    });

    after(function afterTest() {
      getExecutedBetsStub.restore();
    });
  });

  describe('getPendingBets', function getPendingBetsTest() {
    let getPendingBetsStub;
    let pendingEtherBets = [{stub: "pendingBet"}];

    before(function beforeTest() {
      getPendingBetsStub = sinon.stub(etherBetService, "getPendingBets");
      getPendingBetsStub.resolves(pendingEtherBets);
    });

    it('ok', function it(done) {
      request(app)
        .get('/api/ether-bets/pending')
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.bets).to.deep.eq(pendingEtherBets);
          done();
        });
    });

    after(function afterTest() {
      getPendingBetsStub.restore();
    });
  });

  describe('createBet', function createBetTest() {
    let createBetStub;
    let etherBet = {stub: "etherBet"};
    let etherBetData = {
      amount: 100,
      edge: 1,
    };
    let message;

    before(function beforeTest() {
      createBetStub = sinon.stub(etherBetService, "createBet");
      createBetStub.callsFake(function (myEtherBetData) {
        expect(myEtherBetData).to.deep.eq({
          amount: etherBetData.amount,
          edge: etherBetData.edge,
          user: testAddress.public
        });

        return Promise.resolve(etherBet);
      });

      message = signService.buildMessage(etherBetData, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/api/ether-bets')
        .send(message)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.bet).to.deep.eq(etherBet);
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
    };
    let message;

    before(function beforeTest() {
      cancelBetStub = sinon.stub(etherBetService, "cancelBet");
      cancelBetStub.callsFake(function (betId, myAddress) {
        expect(betId).to.eq(data.id);
        expect(myAddress).to.eq(testAddress.public);

        return Promise.resolve();
      });

      message = signService.buildMessage(data, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/api/ether-bets/cancel')
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
      seed: "1111222233334444"
    };
    let message;

    before(function beforeTest() {
      callBetStub = sinon.stub(etherBetService, "callBet");
      callBetStub.callsFake(function (betId, myAddress) {
        expect(betId).to.eq(data.id);
        expect(myAddress).to.eq(testAddress.public);

        return Promise.resolve();
      });

      message = signService.buildMessage(data, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/api/ether-bets/call')
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