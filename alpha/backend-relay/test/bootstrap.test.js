/**
 * Mocha bootstrap file for backend application tests.
 */
'use strict';

global.db = require('../models');

before(async function () {
  // start with clean db
  await db.sequelize.truncate({});
});

afterEach(async function () {
  // clean up db between tests
  await db.sequelize.truncate({});
});