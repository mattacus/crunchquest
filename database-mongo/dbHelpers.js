const logger = require('../server/logger');
const db = require('./models');
require('dotenv').config();
const Places = require('google-places-web').default;

Places.apiKey = process.env.GOOGLE_MAPS_KEY;
Places.debug = false;

let getSearchCacheByLocation = (location) => {
  // use this for search cache testing
  return db.models.NearbySearchCache.findOne({ location: location }).exec();
};

let getLocationInfo = (location) => {
  logger.info('Get Location: ', location);
  return db.models.Location.findOne({ name: location }).exec();
};

let createLocationSearchCache = (location, companyList) => {
  companyList.forEach((company) => {
    Places.nearbysearch({
      location: `${location.centerCoords.lat}, ${location.centerCoords.lng}`,
      keyword: company.name,
      radius: '30000',
    })
      .then((searchResults) => {
        logger.info(searchResults);
        const dbEntry = {
          location: location.name,
          searchCache: JSON.stringify(searchResults),
        };
        db.models.NearbySearchCache.create(dbEntry)
          .then((done) => {
            logger.info('Created entry for: ', location.name);
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

let mongoSave = (rawData) => {
  // format of crunchbase data
  let companyList = rawData.data.items;
  let promisesArray = [];
  // map to mongo schema
  companyList = companyList.forEach((company) => {
    let placeResults = [];
    let locationLatResult = '';
    let locationLngResult = '';
    let placeIDResult = '';

    // attempt to correlate google maps object with crunchbase url
    Places.nearbysearch({
      location: '30.3079827, -97.8934851', // center of Austin
      keyword: company.properties.name,
      radius: '30000',
    })
      .then((places) => {
        let placePromises = [];
        places.forEach((place) => {
          if (place.place_id) {
            let placeSearch = Places.details({ placeid: place.place_id })
              .then((details) => {
                placeResults.push(details);
              })
              .catch((err) => {
                console.log('Error in place details search: ', err);
                placeResults.push('');
              });
            placePromises.push(placeSearch);
          }
        });
        return Promise.all(placePromises);
      })
      .then(() => {
        // console.log(placeResults);
        let location = placeResults.reduce((acc, place) => {
          // console.log(place);
          let suggestedAddress = '';
          if (place.website) {
            let mapsName = place.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/.com.*/, '');
            let crunchName = company.properties.homepage_url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/.com.*/, '');
            console.log(`Website retrieved for ${company.properties.name}: ${place.website}`);
            console.log('Maps website post-regex: ', mapsName);
            console.log('Crunchbase website: ', company.properties.homepage_url);
            console.log('Crunchbase website post-regex: ', crunchName);
            if (mapsName === crunchName) {
              console.log(`Found match for ${company.properties.name}!`);
              suggestedAddress = place.url;
              locationLatResult = String(place.geometry.location.lat);
              locationLngResult = String(place.geometry.location.lng);
              placeIDResult = String(place.id);
              console.log('suggestedAddress: ', suggestedAddress);
              console.log('locationLatResult: ', locationLatResult);
              console.log('locationLngResult: ', locationLngResult);
              console.log('placeIDResult: ', placeIDResult);
            } else {
              console.log('Match not found, continuing...');
            }
          }
          return suggestedAddress || acc;
        }, '');
        return location;
      })
      .then((location) => {
        const dbEntry = {
          name: company.properties.name,
          profile_image: company.properties.profile_image_url,
          short_description: company.properties.short_description,
          homepage_url: company.properties.homepage_url,
          linkedin_url: company.properties.linkedin_url,
          crunchbase_url: `https://www.crunchbase.com/organization/${company.properties.permalink}`,
          indeed_url: `https://www.indeed.com/jobs?q=${company.properties.name}&l=Austin%2C+TX`,
          address: location,
          location_lat: locationLatResult,
          location_long: locationLngResult,
          place_id: placeIDResult,
        };
        let creationPromise = db.models.Company.create(dbEntry);
        creationPromise.catch((err) => { console.log('Error creating db entry: ', err); });
        promisesArray.push(creationPromise);
      })
      .catch((err) => {
        // workaround to generate db entry even if location lookup fails
        console.log(`Error in Query ${company.properties.name}: ${err}`);
        const dbEntry = {
          name: company.properties.name,
          profile_image: company.properties.profile_image_url,
          short_description: company.properties.short_description,
          homepage_url: company.properties.homepage_url,
          linkedin_url: company.properties.linkedin_url,
          crunchbase_url: `https://www.crunchbase.com/organization/${company.properties.permalink}`,
          indeed_url: `https://www.indeed.com/jobs?q=${company.properties.name}&l=Austin%2C+TX`,
          address: undefined,
          location_lat: undefined,
          location_long: undefined,
          place_id: undefined,
        };
        let creationPromise = db.models.Company.create(dbEntry);
        creationPromise.catch((err) => { console.log('Error creating db entry: ', err); });
        promisesArray.push(creationPromise);
      });
  });
  return Promise.all(promisesArray);
};

let checkCollections = () => {
  console.log('Checking collections');
  return db.conn.db.listCollections().toArray();
};

module.exports.mongoSave = mongoSave;
module.exports.getSearchCacheByLocation = getSearchCacheByLocation;
module.exports.checkCollections = checkCollections;
module.exports.getLocationInfo = getLocationInfo;
module.exports.createLocationSearchCache = createLocationSearchCache;
