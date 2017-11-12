'use strict';

const ethUtil = require('ethereumjs-util');

module.exports = function (sequelize, DataTypes) {
  const Bet = sequelize.define('Bet', {
    amount: {
      type: DataTypes.INTEGER,
      validate: {
        isInt: true,
        min: 0
      }
    },
    edge: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true,
        min: -100,
        max: 100
      }
    },
    user: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEthereumAddress(value) {
          if (!ethUtil.isValidAddress(value) ) {
            throw new Error('Not a valid Ethereum Address');
          }
        }
      }
    },
    seed: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        is: ["^[a-z0-9]+$",'i'],
        len: 16,
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
