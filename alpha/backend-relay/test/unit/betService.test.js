'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');

let socketService = require('../../lib/socketService');

let betService = require('../../lib/betService');

describe('createBet', function () {
  let emitStub;

  before(function beforeTest() {
    emitStub = sinon.stub(socketService, "emit");
    emitStub.callsFake(function (event, data) {
      expect(event).to.eq("betCreated");
      expect(data.amount).to.eq(500);
    });
  });

  it('ok', async function it() {
    let bet = await betService.createBet({amount: 500, edge: 1.5, user: "0x001"});

    let myBet = await db.Bet.findById(bet.id);

    expect(myBet.amount).to.equal(500);
    expect(myBet.edge).to.equal(1.5);
    expect(myBet.user).to.equal("0x001");

    expect(emitStub.callCount).to.equal(1);
  });

  after(function afterTest() {
    emitStub.restore();
  });

});


describe('getActiveBets', function () {
  let bet_1, bet_2, bet_3;

  before(async function beforeTest() {
    bet_1 = await db.Bet.create({amount: 500, edge: 1.5, user: "0x001"});
    bet_2 = await db.Bet.create({amount: 500, edge: 1.5, user: "0x002", cancelledAt: new Date()});
    bet_3 = await db.Bet.create({amount: 500, edge: 1.5, user: "0x003", executedAt: new Date()});
  });

  it('ok', async function it() {
    let activeBets = await betService.getActiveBets();

    expect(activeBets.length).to.equal(1);
    expect(activeBets[0].id).to.equal(bet_1.id);
  });
});