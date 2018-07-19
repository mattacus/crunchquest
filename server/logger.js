const bunyan = require('bunyan');

let logger = bunyan.createLogger({
  name: 'crunchquest',
  stream: process.stdout,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
  level: 'debug',
});

module.exports = logger;
