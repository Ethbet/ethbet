'use strict';

var expect = require('chai').expect;

let betService = require('../../lib/betService');

describe('createBet', function testTest() {

  it('ok', async function it() {
    let bet = await betService.createBet({amount: 500, edge: 1.5, user: "0x001"});

    let myBet =  await db.Bet.findById(bet.id);

  //  expect(myBet.amount).to.equal()

  });

  after(async function afterTest() {
    await db.Bet.destroy({
      where: {},
      truncate: true
    })
  });
});