const expect = require('chai').expect;
const sinon = require('sinon');

let randomService = require('../../../lib/randomService');

describe('randomService', function randomServiceTest() {

  describe('generateSeed', function generateSeedTest() {
    it('ok', function it() {
      let seed = randomService.generateSeed();
      expect(/^[a-z0-9]+$/.test(seed)).to.equal(true);
      expect(seed.length).to.eq(16);
    });
  });

});

