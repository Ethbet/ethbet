'use strict';

const Factory = require('rosie').Factory;

const userFactory = new Factory()
  .attr('username', 'mike')
  .attr('address', '0xc1912fee45d61c87cc5ea59dae31190fffff232d');


module.exports = {
  UserFactory: userFactory,
};