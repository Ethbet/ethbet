'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Bets', 'serverSeed'),
      queryInterface.removeColumn('Bets', 'fullSeed'),
      queryInterface.addColumn('Bets', 'serverSeedHash', {
        type: Sequelize.STRING,
        allowNull: true
      }),
    ];
  },
  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('Bets', 'serverSeed',{
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Bets', 'fullSeed',{
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.removeColumn('Bets', 'serverSeedHash'),
    ];
  }
};
