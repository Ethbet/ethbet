'use strict';

const ethUtil = require('ethereumjs-util');

module.exports = function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    username: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: {
          args: [1,16],
          msg: "Must be less than 16 characters"
        },
      },
      unique: true
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        isEthereumAddress(value) {
          if (!ethUtil.isValidAddress(value) ) {
            throw new Error('Not a valid Ethereum Address');
          }
        }
      },
      unique: true
    },

  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return User;
};
