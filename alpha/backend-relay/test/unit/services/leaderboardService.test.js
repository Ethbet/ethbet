const expect = require('chai').expect;
const sinon = require('sinon');

let socketService = require('../../../lib/socketService');
let leaderboardService = require('../../../lib/leaderboardService');

const testAddress = require('../../support/testAddress.json');

const BetFactory = require('../../factories/bets').BetFactory;
const UserFactory = require('../../factories/users').UserFactory;

describe('leaderboardService', function leaderboardServiceTest() {

  let userAddress1 = "0x04bd37D5393cD877f64ad36f1791ED09d847b981";
  let userAddress2 = "0x04bd37D5393cD877f64ad36f1791ED09d847b982";
  let userAddress3 = "0x04bd37D5393cD877f64ad36f1791ED09d847b983";
  let userName1 = 'John';
  let userName2 = 'Mike';

  describe('getLeaderboard', function () {
    before(async function before() {
      await db.User.create(UserFactory.build({
        address: userAddress1,
        username: userName1
      }));
      await db.User.create(UserFactory.build({
        address: userAddress2,
        username: userName2
      }));

      await db.Bet.create(BetFactory.build({
        user: userAddress1,
        callerUser: userAddress2,
        amount: 5000,
        makerWon: true,
        executedAt: new Date()
      }));
      await db.Bet.create(BetFactory.build({
        user: userAddress1,
        callerUser: userAddress3,
        amount: 8000,
        makerWon: false,
        executedAt: new Date()
      }));
      await db.Bet.create(BetFactory.build({
        user: userAddress2,
        callerUser: userAddress3,
        amount: 10000,
        makerWon: true,
        executedAt: new Date()
      }));
      await db.Bet.create(BetFactory.build({
        user: userAddress3,
        callerUser: userAddress1,
        amount: 7000,
        makerWon: false,
        executedAt: new Date()
      }));
    });

    it('ok', async function it() {
      let leaderboard = await leaderboardService.getLeaderboard();

      expect(leaderboard).to.deep.equal([
        {
          "amount": "5000",
          "user": "0x04bd37D5393cD877f64ad36f1791ED09d847b982",
          "username": "Mike",
        },
        {
          "amount": "4000",
          "user": "0x04bd37D5393cD877f64ad36f1791ED09d847b981",
          "username": "John",
        },
        {
          "amount": "-9000",
          "user": "0x04bd37D5393cD877f64ad36f1791ED09d847b983",
          "username": null
        }
      ]);
    });
  });


});

