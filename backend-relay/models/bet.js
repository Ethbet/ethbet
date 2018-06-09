'use strict';

const ethUtil = require('ethereumjs-util');
const _ = require('lodash');

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
        min: -99,
        max: 99
      }
    },
    user: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEthereumAddress(value) {
          if (!ethUtil.isValidAddress(value)) {
            throw new Error('Not a valid Ethereum Address');
          }
        }
      }
    },
    seed: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        is: ["^[a-z0-9]+$", 'i'],
        len: 16,
      }
    },
    callerUser: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEthereumAddress(value) {
          if (!ethUtil.isValidAddress(value)) {
            throw new Error('Not a valid Ethereum Address');
          }
        }
      }
    },
    callerSeed: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        is: ["^[a-z0-9]+$", 'i'],
        len: 16,
      }
    },
    serverSeedHash: {
      type: DataTypes.STRING,
    },
    roll: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true,
        min: 0,
        max: 100
      }
    },
    makerWon: {
      type: DataTypes.BOOLEAN,
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

  Bet.hook('beforeSave', (bet, options) => {
    // round amount and edge
    bet.amount = _.round(bet.amount, 0);
    bet.edge = _.round(bet.edge, 2);
  });

  return Bet;
};
