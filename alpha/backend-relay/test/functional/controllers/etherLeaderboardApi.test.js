const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../../server').app;
const signService = require('../../support/signService');
const testAddress = require('../../support/testAddress.json');

const etherLeaderboardService = require('../../../lib/etherLeaderboardService');

describe('etherLeaderboardApi', function etherLeaderboardApiTest() {

  describe('getLeaderboard', function getLeaderboardTest() {
    let getLeaderboardStub;
    let leaderboard = {stub: "leaderboard"};

    before(function beforeTest() {
      getLeaderboardStub = sinon.stub(etherLeaderboardService, "getLeaderboard");
      getLeaderboardStub.callsFake(function () {
        return Promise.resolve(leaderboard);
      });
    });

    it('ok', function it(done) {
      request(app)
        .get('/api/ether-leaderboard')
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.leaderboard).to.deep.eq(leaderboard);
          done();
        });
    });

    after(function afterTest() {
      getLeaderboardStub.restore();
    });
  });

});