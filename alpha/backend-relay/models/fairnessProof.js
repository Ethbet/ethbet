'use strict';

module.exports = function (sequelize, DataTypes) {
  const FairnessProof = sequelize.define('FairnessProof', {
    serverSeed: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
        len: 16,
      },
    },
    serverSeedHash: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: true,
      },
    },

  }, {
    classMethods: {
      associate: function (models) {
        // associations can be defined here
      }
    }
  });
  return FairnessProof;
};
