'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('Bets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.INTEGER
      },
      edge: {
        type: Sequelize.FLOAT
      },
      user: {
        type: Sequelize.STRING
      },
      seed: {
        type: Sequelize.STRING
      },
      callerUser: {
        allowNull: true,
        type: Sequelize.STRING
      },
      callerSeed: {
        allowNull: true,
        type: Sequelize.STRING
      },
      serverSeed: {
        allowNull: true,
        type: Sequelize.STRING
      },
      fullSeed: {
        allowNull: true,
        type: Sequelize.STRING
      },
      roll: {
        allowNull: true,
        type: Sequelize.FLOAT
      },
      makerWon: {
        allowNull: true,
        type: Sequelize.BOOLEAN
      },
      cancelledAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      executedAt: {
        allowNull: true,
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('Bets');
  }
};