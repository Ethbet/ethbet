const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  name: 'ether-bets-file',
  filename: 'logs/ether-bets.log',
  prepend: true,
  json: false
});

const logger = new (winston.Logger)({
  transports: [
    transport
  ]
});


if (process.env.NODE_ENV === "test") {
  logger.remove('ether-bets-file');
}

module.exports = {
  logger
};