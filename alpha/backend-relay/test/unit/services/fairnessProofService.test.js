const expect = require('chai').expect;
const sinon = require('sinon');
const moment = require('moment');

let fairnessProofService = require('../../../lib/fairnessProofService');
let randomService = require('../../../lib/randomService');

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
    let daySeedExistsStub, generateSeedStub;
    let serverSeed = "1234567890123456";

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


      });

      it('ok', async function it() {
        let fairnessProof = await fairnessProofService.create();

        expect(!!fairnessProof.id).to.equal(true);
        expect(fairnessProof.serverSeed).to.equal(serverSeed);
        expect(fairnessProof.serverSeedHash).to.equal("1f52ed515871c913164398ec24c47088cdf957e81af28c899a8a0195d3620e083968a6d4d86cb8f9bd7f909b23f75a1c044ec8e675c6efbcb0e4bf0eb445525d");
      });

      after(function afterTest() {
        daySeedExistsStub.restore();
        generateSeedStub.restore();
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

  describe('getSeedByHash', function getSeedByHashTest() {

    let fairnessProof_1, fairnessProof_2;

    before(async function before() {
      fairnessProof_1 = await db.FairnessProof.create(FairnessProofFactory.build({
        createdAt: moment().subtract(1, "day").toDate(),
        serverSeed: "1114567890abcdef",
        serverSeedHash: "hash1"
      }));
      fairnessProof_2 = await db.FairnessProof.create(FairnessProofFactory.build({
        serverSeed: "2224567890abcdef",
        serverSeedHash: "hash2"
      }));
    });

    it('only provides not current seed', async function it() {
      let serverSeed_2 = await fairnessProofService.getSeedByHash(fairnessProof_2.serverSeedHash);
      expect(serverSeed_2).to.equal(null);

      let serverSeed_1 = await fairnessProofService.getSeedByHash(fairnessProof_1.serverSeedHash);
      expect(serverSeed_1).to.equal(fairnessProof_1.serverSeed);
    });
  });

});

