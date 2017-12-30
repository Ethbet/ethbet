const expect = require('chai').expect;
const sinon = require('sinon');

let errorService = require('../../../lib/errorService');

describe('errorService', function errorServiceTest() {

  describe('toJson', function toJsonTest() {
    it('no change to other erorrs', function it() {
      let err = new Error("my error message");
      err.name = "SomeError";
      let newErr = errorService.sanitize(err);
      expect(newErr.message).to.eq("my error message");
    });

    it('fix SequelizeDatabaseError', function it() {
      let err = new Error("some sql");
      err.name = "SequelizeDatabaseError";
      let newErr = errorService.sanitize(err);
      expect(newErr.message).to.eq("Database Error");
    });

  });

});

