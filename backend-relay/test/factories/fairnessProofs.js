'use strict';

const Factory = require('rosie').Factory;

const fairnessProofFactory = new Factory()
  .attr('serverSeed', '1234567890abcdef')
  .attr('serverSeedHash', 'XYXYXY');


module.exports = {
  FairnessProofFactory: fairnessProofFactory,
};