const bunyan = require('bunyan');

let logger = bunyan.createLogger({
  name: 'crunchquest',
  stream: process.stdout,
  serializers: {
    err: bunyan.stdSerializers.err,
  },
});

module.exports = logger;
