const expect = require('chai').expect;
const sinon = require('sinon');
const crypto = require('crypto');
const tk = require('timekeeper');

let diceService = require('../../../lib/diceService');
let fairnessProofService = require('../../../lib/fairnessProofService');

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


  describe('calculateRoll', function calculateRollTest() {
    let getCurrentServerSeedStub, generateFullSeedStub;

    let rollInput = {
      makerSeed: "maker12345678901",
      callerSeed: "caller1234567890",
      betId: 46,
    };

    let serverSeed = "server1234567890";
    let fullSeed = "maker12345678901caller1234567890server123456789046";

    before(function beforeTest() {
      tk.freeze(new Date());

      getCurrentServerSeedStub = sinon.stub(fairnessProofService, "getCurrentServerSeed");
      getCurrentServerSeedStub.callsFake(function () {
        return Promise.resolve(serverSeed);
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

    it('ok', async function it() {
      let rollResults = await diceService.calculateRoll(rollInput);
      expect(rollResults).to.deep.eq({
        "executedAt": new Date(),
        "roll": 73.65321634124857,
        "serverSeedHash":  "b3352ec79cc8e21ab6fe363e35f795e8b2ff9eba1c228c0eaacc7737a32de10539511aa06f28bdd67a0756044d24baf220b209f99cc417b024cc275a46d799f8"
      });
    });

    after(function afterTest() {
      tk.reset();
      getCurrentServerSeedStub.restore();
      generateFullSeedStub.restore();
    });

  });

});

