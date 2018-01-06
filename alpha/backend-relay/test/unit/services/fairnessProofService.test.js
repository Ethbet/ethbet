const expect = require('chai').expect;
const sinon = require('sinon');
const moment = require('moment');

let fairnessProofService = require('../../../lib/fairnessProofService');

const FairnessProofFactory = require('../../factories/fairnessProofs').FairnessProofFactory;

describe('fairnessProofService', function fairnessProofServiceTest() {

  describe('daySeedExists', function () {
    context('does not exist', function context() {
      before(async function before() {
        await db.FairnessProof.create(FairnessProofFactory.build({
          createdAt: moment().subtract(1, 'day').toDate()
        }));
      });

      it('ok', async function it() {
        let isDaySeedExists = await fairnessProofService.daySeedExists();

        expect(isDaySeedExists).to.equal(false);
      });
    });

    context('exists', function context() {
      before(async function before() {
        await db.FairnessProof.create(FairnessProofFactory.build({}));
      });

      it('ok', async function it() {
        let isDaySeedExists = await fairnessProofService.daySeedExists();

        expect(isDaySeedExists).to.equal(true);
      });
    });
  });

  describe('create', function () {
    throw new Error()
  });

});

