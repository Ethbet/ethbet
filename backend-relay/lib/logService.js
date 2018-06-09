const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  name: 'bets-file',
  filename: 'logs/bets.log',
  prepend: true,
  json: false
});

const logger = new (winston.Logger)({
  transports: [
    transport
  ]
});


if (process.env.NODE_ENV === "test") {
  logger.remove('bets-file');
}

module.exports = {
  logger
};