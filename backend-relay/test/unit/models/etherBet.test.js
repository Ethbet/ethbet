'use strict';

const expect = require('chai').expect;

const EtherBetFactory = require('../../factories/etherBets').EtherBetFactory;


describe('EtherBet', function () {
  describe('validation', function validationTest() {

    context('no errors', function context() {
      it('saves', async function it() {
        let etherBet = await db.EtherBet.create(EtherBetFactory.build());

        expect(!!etherBet.id).to.eq(true);
      });
    });

    context('errors', function context() {
      it('amount not float', async function it() {
        try {
          await db.EtherBet.create(EtherBetFactory.build({amount: "hello"}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation isFloat on amount failed')
        }
      });

      it('amount negative', async function it() {
        try {
          await db.EtherBet.create(EtherBetFactory.build({amount: -5}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation min on amount failed')
        }
      });

      it('edge < 100', async function it() {
        try {
          await db.EtherBet.create(EtherBetFactory.build({edge: -101}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation min on edge failed')
        }
      });

      it('edge > 100', async function it() {
        try {
          await db.EtherBet.create(EtherBetFactory.build({edge: 101}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation max on edge failed')
        }
      });



      it('user address invalid', async function it() {
        try {
          await db.EtherBet.create(EtherBetFactory.build({user: "12348ccc"}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Not a valid Ethereum Address')
        }
      });

    });

  });
});