const mongoose = require('mongoose');

const crunchbaseSchema = new mongoose.Schema({
  name: String,
  profile_image: String,
  short_description: String,
  homepage_url: String,
  linkedin_url: String,
  crunchbase_url: String,
  indeed_url: String,
  address: String,
  location_lat: String,
  location_long: String,
  place_id: String,
});

module.exports = mongoose.model('Company', crunchbaseSchema);
