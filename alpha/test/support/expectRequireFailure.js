const isRequireError = require('./isRequireError');


async function expectRequireFailure(cb) {
  try {
    await cb();

    // we shouldn't get to this point
    assert(false, "Transaction should have failed");
  }
  catch (err) {
    if (!isRequireError(err)) {
      assert(false, err.toString());
    }
  }
}

module.exports = expectRequireFailure;