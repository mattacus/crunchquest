const mongoose = require('mongoose');

const nearbySearchCacheSchema = new mongoose.Schema({
  location: String,
  searchCache: String, // => Just dump everything into stringified JSON string for now
});

module.exports = mongoose.model('NearbySearchCache', nearbySearchCacheSchema);
