'use strict';

const expect = require('chai').expect;

const UserFactory = require('../../factories/users').UserFactory;


describe('user', function () {
  describe('validation', function validationTest() {

    context('no errors', function context() {
      it('saves', async function it() {
        let user = await db.User.create(UserFactory.build());

        expect(!!user.id).to.eq(true);
      });
    });

    context('errors', function context() {
      it('user not unique', async function it() {
        try {
          await db.User.create(UserFactory.build({
            username: "mike",
            address: "0xc1912fee45d61c87cc5ea59dae31190fffff232d"
          }));
          await db.User.create(UserFactory.build({
            username: "mike",
            address: "0xc1912fee45d61c87cc5ea59dae31190fffff232e"
          }));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.name).to.eq('SequelizeUniqueConstraintError')
        }
      });

      it('address not unique', async function it() {
        try {
          await db.User.create(UserFactory.build({
            username: "mike",
            address: "0xc1912fee45d61c87cc5ea59dae31190fffff232d"
          }));
          await db.User.create(UserFactory.build({
            username: "john",
            address: "0xc1912fee45d61c87cc5ea59dae31190fffff232d"
          }));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.name).to.eq('SequelizeUniqueConstraintError')
        }
      });

      it('address invalid', async function it() {
        try {
          await db.User.create(UserFactory.build({address: "12348ccc"}));

          throw new Error("Validation should have failed");
        }
        catch (err) {
          expect(err.message).to.eq('Validation error: Not a valid Ethereum Address')
        }
      });

    });

  });
});