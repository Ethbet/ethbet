const expect = require('chai').expect;
const sinon = require('sinon');

let socketService = require('../../../lib/socketService');
let userService = require('../../../lib/userService');

const testAddress = require('../../support/testAddress.json');

const UserFactory = require('../../factories/users').UserFactory;

describe('userService', function userServiceTest() {

  describe('createUser', function () {
    let userData = {
      username: "bob",
      address: testAddress.public,
    };

    context('does not exist, creating', function context() {
      it('ok', async function it() {
        let user = await userService.createUser(userData);

        let myUser = await db.User.findById(user.id);

        expect(myUser.username).to.equal(userData.username);
        expect(myUser.address).to.equal(userData.address);
      });
    });

    context('exists, updating', function context() {
      before(async function before() {
        await userService.createUser(Object.assign({}, userData, {username: "mike"}));
      });

      it('ok', async function it() {
        let user = await userService.createUser(userData);

        let myUser = await db.User.findById(user.id);

        expect(myUser.username).to.equal(userData.username);
        expect(myUser.address).to.equal(userData.address);
      });
    });
  });

  describe('getUser', function () {
    context('does not exist', function context() {
      it('ok', async function it() {
        let user = await userService.getUser(testAddress.public);

        expect(user).to.equal(null);
      });
    });

    context('exists', function context() {
      before(async function before() {
        await db.User.create(UserFactory.build({address: testAddress.public, username: 'John'}));
      });

      it('ok', async function it() {
        let user = await userService.getUser(testAddress.public);

        expect(user.address).to.equal(testAddress.public);
        expect(user.username).to.equal('John');
      });
    });
  });

});

