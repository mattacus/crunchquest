const db = require('../database-mongo/models');
const Places = require('google-places-web').default;
require('dotenv').config();

Places.apiKey = process.env.GOOGLE_MAPS_KEY;
Places.debug = false;

let createLocationSearchCache = (location, companyList) => {
  companyList.forEach((company) => {
    Places.nearbysearch({
      location: `${location.centerCoords.lat}, ${location.centerCoords.lng}`,
      keyword: company.properties.name,
      radius: '30000',
    })
      .then((searchResults) => {
        console.log(JSON.stringify(searchResults.data));
        const dbEntry = {
          location,
          searchCache: JSON.stringify(searchResults.data),
        };
        db.models.NearbySearchCache.create(dbEntry)
          .then((done) => {
            console.log('Created entry for: ', location);
            console.log(done);
          })
          .catch((err) => {
            console.log(err);
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });
};

module.exports.createLocationSearchCache = createLocationSearchCache;
