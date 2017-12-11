const request = require('supertest');
const sinon = require('sinon');
const expect = require('chai').expect;
const app = require('../../../server').app;
const signService = require('../../support/signService');
const testAddress = require('../../support/testAddress.json');

const userService = require('../../../lib/userService');

describe('usersApi', function usersApiTest() {

  describe('createUser', function createUserTest() {
    let createUserStub;
    let user = {stub: "user"};
    let userData = {
      username: "johny",
    };
    let message;

    before(function beforeTest() {
      createUserStub = sinon.stub(userService, "createUser");
      createUserStub.callsFake(function (myUserData) {
        expect(myUserData).to.deep.eq({
          username: userData.username,
          address: testAddress.public
        });

        return Promise.resolve(user);
      });

      message = signService.buildMessage(userData, testAddress);
    });

    it('ok', function it(done) {
      request(app)
        .post('/users')
        .send(message)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.user).to.deep.eq(user);
          done();
        });
    });

    after(function afterTest() {
      createUserStub.restore();
    });
  });


  describe('getUser', function getUserTest() {
    let getUserStub;
    let user = {stub: "user"};

    before(function beforeTest() {
      getUserStub = sinon.stub(userService, "getUser");
      getUserStub.callsFake(function (userAddress) {
        expect(userAddress).to.eq(testAddress.public);

        return Promise.resolve(user);
      });
    });

    it('ok', function it(done) {
      request(app)
        .get('/users/' + testAddress.public)
        .expect(200)
        .end(function (error, result) {
          if (error) {
            return done(error);
          }

          expect(result.body.user).to.deep.eq(user);
          done();
        });
    });

    after(function afterTest() {
      getUserStub.restore();
    });
  });


});