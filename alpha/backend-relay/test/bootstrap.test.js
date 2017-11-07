/**
 * Mocha bootstrap file for backend application tests.
 */
'use strict';

global.db = require('../models');

before(async function () {
  await db.sequelize.sync({force: true});
});

