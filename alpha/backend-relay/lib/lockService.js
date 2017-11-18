const lockFile = require('lockfile');

function lock(id, opts = null) {
  return new Promise((resolve, reject) => {
    if (!opts) {
      opts = {
        wait: 2000,
        pollPeriod: 200,
        stale: 180000 // stale after 3 minutes
      };
    }
    lockFile.lock(`/tmp/${id}.lock`, opts, function (err) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}

function unlock(id) {
  return new Promise((resolve, reject) => {
    lockFile.unlock(`/tmp/${id}.lock`, function (err) {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
}

module.exports = {
  lock,
  unlock
};