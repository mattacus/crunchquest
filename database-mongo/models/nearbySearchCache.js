const mongoose = require('mongoose');

const nearbySearchCacheSchema = new mongoose.Schema({
  company: String,
  location: String,
  searchDetailsCache: Object, // => Just dump everything into stringified JSON string for now
});

module.exports = mongoose.model('NearbySearchCache', nearbySearchCacheSchema);
