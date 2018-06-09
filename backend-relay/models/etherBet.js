'use strict';

const ethUtil = require('ethereumjs-util');
const _ = require('lodash');

module.exports = function (sequelize, DataTypes) {
  const EtherBet = sequelize.define('EtherBet', {
    amount: {
      type: DataTypes.FLOAT,
      validate: {
        isFloat: true,
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
    // query id returned by oraclize
    queryId: {
      type: DataTypes.STRING,
    },
    // random bytes returned by oraclize
    randomBytes: {
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
    initializedAt: DataTypes.DATE,
    executedAt: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });

  EtherBet.hook('beforeSave', (bet, options) => {
    // round amount and edge
    bet.amount = _.round(bet.amount, 4);
    bet.edge = _.round(bet.edge, 2);
  });

  return EtherBet;
};
