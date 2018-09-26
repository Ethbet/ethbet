'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return [
      queryInterface.addColumn('Bets', 'txHash', {
        type: Sequelize.STRING,
        allowNull: true
      }),
      queryInterface.addColumn('Bets', 'txSuccess', {
        type: Sequelize.BOOLEAN,
        allowNull: true
      }),
    ];
  },
  down: function (queryInterface, Sequelize) {
    return [
      queryInterface.removeColumn('Bets', 'txHash'),
      queryInterface.removeColumn('Bets', 'txSuccess'),
    ];
  }
};
