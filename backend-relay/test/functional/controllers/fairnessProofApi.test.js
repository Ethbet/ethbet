const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../../server').app;
const signService = require('../../support/signService');
const testAddress = require('../../support/testAddress.json');

const fairnessProofService = require('../../../lib/fairnessProofService');

describe('fairnessProofApi', function fairnessProofApiTest() {

  describe('getFairnessProofs', function getFairnessProofsTest() {
    let getFairnessProofsStub;
    let fairnessProofs = [{stub: "fairnessProof"}];

    before(function beforeTest() {
      getFairnessProofsStub = sinon.stub(fairnessProofService, "getFairnessProofs");
      getFairnessProofsStub.callsFake(function () {
        return Promise.resolve(fairnessProofs);
      });
    });

    it('ok', function it(done) {
      request(app)
        .get('/api/fairness-proofs')
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.fairnessProofs).to.deep.eq(fairnessProofs);
          done();
        });
    });

    after(function afterTest() {
      getFairnessProofsStub.restore();
    });
  });

});