const mongoose = require('mongoose');

const nearbySearchCacheSchema = new mongoose.Schema({
  name: String,
  location: String,
  searchDetailsCache: String, // => Just dump everything into stringified JSON string for now
});

module.exports = mongoose.model('NearbySearchCache', nearbySearchCacheSchema);
