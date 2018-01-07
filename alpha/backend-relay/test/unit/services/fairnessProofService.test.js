const expect = require('chai').expect;
const sinon = require('sinon');
const moment = require('moment');

let fairnessProofService = require('../../../lib/fairnessProofService');
let randomService = require('../../../lib/randomService');
let diceService = require('../../../lib/diceService');


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
    let daySeedExistsStub, generateSeedStub, generateSeedHashDigestStub;
    let serverSeed = "1234567890123456";
    let serverSeedHash = "server-seed-hash";

    context('does not exist', function context() {
      before(function beforeTest() {
        daySeedExistsStub = sinon.stub(fairnessProofService, "daySeedExists");
        daySeedExistsStub.callsFake(function () {
          return Promise.resolve(false);
        });

        generateSeedStub = sinon.stub(randomService, "generateSeed");
        generateSeedStub.callsFake(function () {
          return (serverSeed);
        });

        generateSeedHashDigestStub = sinon.stub(diceService, "generateSeedHashDigest");
        generateSeedHashDigestStub.callsFake(function () {
          return (serverSeedHash);
        });
      });

      it('ok', async function it() {
        let fairnessProof = await fairnessProofService.create();

        expect(!!fairnessProof.id).to.equal(true);
        expect(fairnessProof.serverSeed).to.equal(serverSeed);
        expect(fairnessProof.serverSeedHash).to.equal(serverSeedHash);
      });

      after(function afterTest() {
        daySeedExistsStub.restore();
        generateSeedStub.restore();
        generateSeedHashDigestStub.restore();
      });
    });

    context('exists', function context() {
      before(function beforeTest() {
        daySeedExistsStub = sinon.stub(fairnessProofService, "daySeedExists");
        daySeedExistsStub.callsFake(function () {
          return Promise.resolve(true);
        });
      });

      it('ok', async function it() {
        try {
          let fairnessProof = await fairnessProofService.create();

          throw new Error("should have raised error");
        }
        catch (err) {
          expect(err.message).to.eq("Daily Server seed has already been generated");
        }
      });

      after(function afterTest() {
        daySeedExistsStub.restore();
      });
    });
  });

  describe('getCurrentServerSeed', function getCurrentServerSeedTest() {
    context('does not exist', function context() {
      before(async function before() {
        await db.FairnessProof.create(FairnessProofFactory.build({
          createdAt: moment().subtract(1, 'day').toDate()
        }));
      });

      it('ok', async function it() {
        try {
          let serverSeed = await fairnessProofService.getCurrentServerSeed();

          throw new Error("should have raised error");
        }
        catch (err) {
          expect(err.message).to.eq("Server Seed not generated");
        }
      });
    });

    context('exists', function context() {
      let fairnessProof;

      before(async function before() {
        fairnessProof = await db.FairnessProof.create(FairnessProofFactory.build({}));
      });

      it('ok', async function it() {
        let serverSeed = await fairnessProofService.getCurrentServerSeed();

        expect(serverSeed).to.equal(fairnessProof.serverSeed);
      });
    });
  });

  describe('getFairnessProofs', function getFairnessProofsTest() {
    before(async function before() {
      await  db.FairnessProof.create(FairnessProofFactory.build({
        serverSeed: "0234567890123456",
        serverSeedHash: "hash0"
      }));
      await  db.FairnessProof.create(FairnessProofFactory.build({
        serverSeed: "1234567890123456",
        serverSeedHash: "hash1",
        createdAt: moment().subtract(1, 'day').toDate()
      }));
      await  db.FairnessProof.create(FairnessProofFactory.build({
        serverSeed: "2234567890123456",
        serverSeedHash: "hash2",
        createdAt: moment().subtract(2, 'day').toDate()
      }));
    });

    it('ok', async function it() {
      let fairnessProofs = await fairnessProofService.getFairnessProofs();

      expect(fairnessProofs.length).to.eq(3);

      expect(fairnessProofs[0].serverSeed).to.equal(null);
      expect(fairnessProofs[0].serverSeedHash).to.equal("hash0");
      expect(fairnessProofs[1].serverSeed).to.equal("1234567890123456");
      expect(fairnessProofs[1].serverSeedHash).to.equal("hash1");
      expect(fairnessProofs[2].serverSeed).to.equal("2234567890123456");
      expect(fairnessProofs[2].serverSeedHash).to.equal("hash2");
    });
  });

});

