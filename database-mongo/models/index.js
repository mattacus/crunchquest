const mongoose = require('mongoose');
require('dotenv').config();

console.log('Using database: ', process.env.MONGODB_URI);

mongoose.connect(process.env.MONGODB_URI, {
  reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
  reconnectInterval: 500, // Reconnect every 1000ms
  poolSize: 10, // Maintain up to 10 socket connections, // Reconnect every 500ms
});

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const company = require('./companies.js');
const location = require('./locations.js');
const nearbySearchCache = require('./nearbySearchCache.js');

const models = {
  Company: company,
  Location: location,
  NearbySearchCache: nearbySearchCache,
};

module.exports.models = models;
module.exports.conn = db;
