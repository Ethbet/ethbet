const expect = require('chai').expect;
const sinon = require('sinon');

let lockService = require('../../../lib/lockService');

describe('lockService', function lockServiceTest() {

  describe('lock/unlock', function lockUnlockTest() {
    let id, opts;

    before(function beforeTest() {
      opts = {
        wait: 500,
        pollPeriod: 50,
        stale: 5000 // stale after 1 second
      };

      id = 'test-bet-' + Math.floor(Math.random() * 10000);
    });

    it('ok', async function it() {
      await lockService.lock(id, opts);

      // attempt with other id should pass
      await lockService.lock(id + '123', opts);

      // second attempt with same id fails
      try {
        await lockService.lock(id, opts);

        throw new Error("Lock should have failed");
      }
      catch (err) {
        expect(err.code).to.equal('EEXIST');
      }

      await lockService.unlock(id);

      // relocking works after unlock
      await lockService.lock(id, opts);

      //final unlock
      await lockService.unlock(id);
    });

  });

});

