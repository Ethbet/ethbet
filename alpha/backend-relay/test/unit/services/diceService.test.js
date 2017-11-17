const expect = require('chai').expect;
const sinon = require('sinon');
const crypto = require('crypto');
const tk = require('timekeeper');

let diceService = require('../../../lib/diceService');
let randomService = require('../../../lib/randomService');

describe('diceService', function diceServiceTest() {

  describe('generateFullSeed', function generateFullSeedTest() {
    it('ok', function it() {
      let makerSeed = "maker12345678901",
        callerSeed = "caller1234567890",
        serverSeed = "server1234567890",
        betId = 45;
      let seed = diceService.generateFullSeed(makerSeed, callerSeed, serverSeed, betId);
      expect(seed).to.equal("maker12345678901caller1234567890server123456789045");
    });
  });

  describe('generateSeedHashDigest', function generateSeedHashDigestTest() {
    it('ok', function it() {
      let seed = "maker12345678901caller1234567890server123456789045";
      let digest = diceService.generateSeedHashDigest(seed);
      expect(digest).to.equal(crypto.createHash('sha512').update(seed).digest('hex'));
    });
  });


  describe('calculateRoll', function calculateRollTest() {
    let generateSeedStub, generateFullSeedStub;

    let rollInput = {
      makerSeed: "maker12345678901",
      callerSeed: "caller1234567890",
      betId: 46,
    };

    let serverSeed = "server1234567890";
    let fullSeed = "maker12345678901caller1234567890server123456789046";

    before(function beforeTest() {
      tk.freeze(new Date());

      generateSeedStub = sinon.stub(randomService, "generateSeed");
      generateSeedStub.callsFake(function () {
        return serverSeed;
      });

      generateFullSeedStub = sinon.stub(diceService, "generateFullSeed");
      generateFullSeedStub.callsFake(function (makerSeed, callerSeed, serverSeed, betId) {
        expect(makerSeed).to.eq(rollInput.makerSeed);
        expect(callerSeed).to.eq(rollInput.callerSeed);
        expect(serverSeed).to.eq(serverSeed);
        expect(betId).to.eq(rollInput.betId);

        return fullSeed;
      });

    });

    it('ok', function it() {
      let rollResults = diceService.calculateRoll(rollInput);
      expect(rollResults).to.deep.eq({
        "executedAt": new Date(),
        "fullSeed": "maker12345678901caller1234567890server123456789046",
        "roll": 73.65321634124857,
        "serverSeed": "server1234567890"
      });
    });

    after(function afterTest() {
      tk.reset();
      generateSeedStub.restore();
      generateFullSeedStub.restore();
    });

  });

});

