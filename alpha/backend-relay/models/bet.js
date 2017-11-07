'use strict';
module.exports = function(sequelize, DataTypes) {
  var Bet = sequelize.define('Bet', {
    amount: DataTypes.FLOAT,
    edge: DataTypes.FLOAT,
    user: DataTypes.STRING,
    cancelledAt: DataTypes.DATE,
    executedAt: DataTypes.DATE,
  }, {
    classMethods: {
      associate: function(models) {
        // associations can be defined here
      }
    }
  });
  return Bet;
};
