const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  name: String,
  centerCoords: {
    lat: String,
    lng: String,
  },
});

module.exports = mongoose.model('Location', locationSchema);
