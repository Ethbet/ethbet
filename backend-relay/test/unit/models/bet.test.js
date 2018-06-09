'use strict';

const expect = require('chai').expect;

const BetFactory = require('../../factories/bets').BetFactory;


describe('Bet', function () {
  describe('validation', function validationTest() {

    context('no errors', function context() {
      it('saves', async function it() {
        let bet = await db.Bet.create(BetFactory.build());

        expect(!!bet.id).to.eq(true);
      });
    });

    context('errors', function context() {
      it('amount not int', async function it() {
        try {
          await db.Bet.create(BetFactory.build({amount: "hello"}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation isInt on amount failed')
        }
      });

      it('amount negative', async function it() {
        try {
          await db.Bet.create(BetFactory.build({amount: -5}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation min on amount failed')
        }
      });

      it('edge < 100', async function it() {
        try {
          await db.Bet.create(BetFactory.build({edge: -101}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation min on edge failed')
        }
      });

      it('edge > 100', async function it() {
        try {
          await db.Bet.create(BetFactory.build({edge: 101}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation max on edge failed')
        }
      });

      it('seed length invalid', async function it() {
        try {
          await db.Bet.create(BetFactory.build({seed: "abcd7878"}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Validation len on seed failed')
        }
      });

      it('user address invalid', async function it() {
        try {
          await db.Bet.create(BetFactory.build({user: "12348ccc"}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Not a valid Ethereum Address')
        }
      });

    });

  });
});