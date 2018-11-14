const winston = require('winston');
require('winston-daily-rotate-file');

const transport = new (winston.transports.DailyRotateFile)({
  filename: '%DATE%.ether-bets.log',
  dirname: './logs',
  json: false
});

const logger = winston.createLogger({
  transports: [
    transport
  ]
});


if (process.env.NODE_ENV === "test") {
  logger.remove(transport);
}

module.exports = {
  logger
};