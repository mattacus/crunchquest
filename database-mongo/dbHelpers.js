const logger = require('../server/logger');
const db = require('./models');
require('dotenv').config();
const Places = require('google-places-web').default;
const mp = require('./mapDataCorrelator.js');

Places.apiKey = process.env.GOOGLE_MAPS_KEY;
Places.debug = false;

//
// ─── CLIENT REQUEST HELPERS ─────────────────────────────────────────────────────
//

let getCompanies = (location) => {
  logger.info('Get companies in ', location);
  return db.models.Company.find({ location }).exec();
};

let getLocations = () => {
  return db.models.Location.find().exec();
};

let getLocationInfo = (location) => {
  logger.info('Get Location: ', location);
  return db.models.Location.findOne({ name: location }).exec();
};

let checkCollections = () => {
  console.log('Checking collections');
  return db.conn.db.listCollections().toArray();
};


//
// ─── SEARCH CACHING HELPERS ─────────────────────────────────────────────────────
//

let createLocationSearchCache = (location, companyList) => {
  let placePromises = [];
  companyList.forEach((company) => {
    let currentSearch = Places.nearbysearch({
      location: `${location.centerCoords.lat}, ${location.centerCoords.lng}`,
      keyword: company,
      radius: '30000',
    });
    placePromises.push(currentSearch);
    currentSearch.then((searchResults) => {
      let detailsPromises = [];

      // create a promise for each place details lookup
      searchResults.forEach((result) => {
        if (result.place_id) {
          detailsPromises.push(Places.details({ placeid: result.place_id }));
        }
      });

      // batch add search details to cache
      Promise.all(detailsPromises)
        .then((details) => {
          logger.info(`Got search results for ${company}`);
          const documents = details.map(item => ({
            company,
            location: location.name,
            searchDetailsCache: item,
          }));
          // logger.debug(documents);
          return db.models.NearbySearchCache.insertMany(documents);
        })
        .then(() => {
          logger.info(`Created search cache entry for: ${company} in ${location.name}`);
        })
        .catch((err) => {
          logger.error(err);
        });
    })
      .catch((err) => {
        if (err == 'Error: ZERO_RESULTS') {
          logger.warn(err);
        } else {
          logger.error(err);
        }
      });
  });
  // logger.debug('Promises: ', placePromises);
  return Promise.all(placePromises.map(p => p.catch(() => undefined)));
};

// use this for search cache testing
let getSearchCacheByLocation = location => db.models.NearbySearchCache.findOne({ location }).exec();

//
// ─── CRUNCHBASE HELPERS ─────────────────────────────────────────────────────────
//

let saveCrunchbaseCompanies = (crunchbaseData, searchLocation) => {
  let companies = crunchbaseData.data.items;
  let dbSavePromises = [];
  companies.forEach((company) => {
    const dbEntry = {
      name: company.properties.name,
      location: searchLocation || null,
      profile_image: company.properties.profile_image_url,
      short_description: company.properties.short_description,
      homepage_url: company.properties.homepage_url,
      linkedin_url: company.properties.linkedin_url,
      crunchbase_url: `https://www.crunchbase.com/organization/${company.properties.permalink}`,
      indeed_url: `https://www.indeed.com/jobs?q=${company.properties.name}&l=Austin%2C+TX`,
    };
    let creationPromise = db.models.Company.create(dbEntry);
    creationPromise.catch((err) => { console.log('Error creating db entry: ', err); });
    dbSavePromises.push(creationPromise);
  });

  return Promise.all(dbSavePromises);
};

let matchAddressToCompanies = (location) => {
  logger.info('Gathering companies from database...');
  let companyCount;
  let successCount = 0;
  let addressUpdatePromises = [];
  let countPromise = db.models.Company.count({ location }).exec();
  // addressUpdatePromises.push(countPromise);
  countPromise.then((count) => {
    companyCount = count;
  })
    .catch((err) => {
      logger.error(err);
    });

  return db.models.Company.find({ location }).exec()
    .then((companies) => {
      logger.info('Companies found');
      logger.info('Loading data from search cache...');
      logger.debug('last company: ', companies[companies.length - 1].name);

      companies.forEach((company, index) => {
      // for (let i = 0; i < 10; i++) {
        // let company = companies[i];
        db.models.NearbySearchCache.find({ company: company.name })
          .then((searchResults) => {
            let locationDetails = mp.correlateTLDJSMapData(searchResults, company);
            if (locationDetails) {
              // logger.debug(locationDetails);
              successCount += 1;
              let addressUpdate = company.update({
                address: locationDetails.suggestedAddress,
                location_lat: locationDetails.locationLatResult,
                location_long: locationDetails.locationLngResult,
                place_id: locationDetails.placeIDResult,
              }).exec();
              addressUpdatePromises.push(addressUpdate);
              // on last element, publish success rate
              if (index >= companies.length - 1) {
                Promise.all(addressUpdatePromises.map(p => p.catch(() => undefined)))
                  .then(() => {
                    logger.info(`Located ${successCount}/${companyCount} companies`);
                    if (companyCount > 0) {
                      logger.info(`Success rate: ${Math.round((successCount / companyCount) * 100)}%`);
                    }
                  })
                  .catch((err) => {
                    logger.error(err);
                  });
              }
            } else {
              logger.info('No matches found for', company.name);
            }
          })
          .catch((err) => {
            logger.error(err);
          });
      // }
      });
    })
    .catch((err) => {
      logger.error(err);
    });
};

module.exports.getCompanies = getCompanies;
module.exports.getLocations = getLocations;
module.exports.getSearchCacheByLocation = getSearchCacheByLocation;
module.exports.checkCollections = checkCollections;
module.exports.getLocationInfo = getLocationInfo;
module.exports.createLocationSearchCache = createLocationSearchCache;
module.exports.saveCrunchbaseCompanies = saveCrunchbaseCompanies;
module.exports.matchAddressToCompanies = matchAddressToCompanies;
