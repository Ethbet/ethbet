const expect = require('chai').expect;
const sinon = require('sinon');
const crypto = require('crypto');
const tk = require('timekeeper');

let cryptoService = require('../../../lib/cryptoService');

describe('cryptoService', function cryptoServiceTest() {

  describe('generateSeedHashDigest', function generateSeedHashDigestTest() {
    it('ok', function it() {
      let seed = "maker12345678901caller1234567890server123456789045";
      let digest = cryptoService.generateSeedHashDigest(seed);
      expect(digest).to.equal(crypto.createHash('sha512').update(seed).digest('hex'));
    });
  });

});

