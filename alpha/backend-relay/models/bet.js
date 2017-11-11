'use strict';
module.exports = function (sequelize, DataTypes) {
  var Bet = sequelize.define('Bet', {
    amount: {
      type: DataTypes.FLOAT,
      validate: {
        min:0
      }
    },
    edge: {
      type: DataTypes.FLOAT,
      validate: {
        min:0
      }
    },
    user: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    seed: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      }
    },
    cancelledAt: DataTypes.DATE,
    executedAt: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return Bet;
};
