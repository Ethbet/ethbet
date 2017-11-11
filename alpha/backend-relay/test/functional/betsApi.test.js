const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../server').app;
const signService = require('../support/signService');
const testAddress = require('../support/testAddress.json');

const betService = require('../../lib/betService');

describe('betsApi', function betsApiTest() {

  describe('getActiveBets', function getActiveBetsTest() {
    let getActiveBetsStub;
    let activeBets = [{stub: "activeBet"}];

    before(function beforeTest() {
      getActiveBetsStub = sinon.stub(betService, "getActiveBets");
      getActiveBetsStub.resolves(activeBets);
    });

    it('ok', function it(done) {
      request(app)
        .get('/bets/active')
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.bets).to.deep.eq(activeBets);
          done();
        });
    });

    after(function afterTest() {
      getActiveBetsStub.restore();
    });
  });

  describe('createBet', function createBetTest() {
    let createBetStub;
    let bet = {stub: "bet"};
    let betData = {
      amount: 100,
      edge: 1,
      user: testAddress.public,
      seed: "123456123456abcd"
    };
    let message;

    before(function beforeTest() {
      createBetStub = sinon.stub(betService, "createBet");
      createBetStub.callsFake(function (myBetData) {
        expect(myBetData).to.deep.eq(betData);

        return Promise.resolve(bet);
      });

      message = signService.buildMessage(betData,testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/bets')
        .send(message)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.bet).to.deep.eq(bet);
          done();
        });
    });

    after(function afterTest() {
      createBetStub.restore();
    });
  });

});