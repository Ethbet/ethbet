'use strict';

const Factory = require('rosie').Factory;

const betFactory = new Factory()
  .attr('amount', 5)
  .attr('edge', 1)
  .attr('user', '0xc1912fee45d61c87cc5ea59dae31190fffff232d')
  .attr('seed', '123456123456abcd');


module.exports = {
  BetFactory: betFactory,
};