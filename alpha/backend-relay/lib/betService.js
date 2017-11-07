const Op = db.Sequelize.Op;

async function createBet(betData) {
  let bet = await db.Bet.create(betData);

  return bet;
}

async function getBets() {
  let bets = await db.Bet.findAll({
    where: {
      cancelledAt: {
        [Op.ne]: null
      },
      executedAt: {
        [Op.ne]: null
      },
    },
    order: [
      ['createdAt', 'DESC']
    ]
  });

  return bets;
}

module.exports = {
  createBet: createBet,
  getBets: getBets
};