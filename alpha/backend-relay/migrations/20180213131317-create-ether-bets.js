'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('EtherBets', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      amount: {
        type: Sequelize.FLOAT
      },
      edge: {
        type: Sequelize.FLOAT
      },
      user: {
        type: Sequelize.STRING
      },
      callerUser: {
        allowNull: true,
        type: Sequelize.STRING
      },
      queryId: {
        allowNull: true,
        type: Sequelize.STRING
      },
      randomBytes: {
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
      initializedAt: {
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
    return queryInterface.dropTable('EtherBets');
  }
};