const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('../database-mongo/dbHelpers.js');
const fs = require('fs');
const axios = require('axios');
const morgan = require('morgan');
require('dotenv').config();

const PORT = process.env.PORT || 3000;
const BATCH_LENGTH = 100; // length used to batch caching requests

const app = express();

// MIDDLEWARES
app.use(express.static(`${__dirname}/../react-client/dist`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(morgan('dev'));

app.post('/createSearchCache', (req, res) => {
  let { location } = req.body;
  if (!location) {
    res.status(400).send('Err: no location supplied');
  }
  mongo.getLocationInfo(location)
    .then((locationInfo) => {
      if (locationInfo) {
        mongo.getCompanies(location)
          .then((companies) => {
            if (!companies.length) {
              logger.error('No companies found for ', location);
              res.status(404).send(`No companies found for ${location}`);
            } else {
              let companyNames = companies.map(company => company.name);
              logger.info(`Creating location search cache for ${location}`);
              let spliceLength = companyNames.length < BATCH_LENGTH ?
                companyNames.length : BATCH_LENGTH;
              // mongo.createLocationSearchCache(locationInfo, ['HomeAway']);

              // recursive function for batch processing
              let next = () => {
                logger.debug(`Next called with length ${companyNames.length}`);
                if (companyNames.length > 0) {
                  let batch = companyNames.splice(0, spliceLength);
                  let searchPromise = mongo.createLocationSearchCache(locationInfo, batch);
                  searchPromise
                    .then(() => {
                      logger.info(`Completed batch of ${spliceLength}...`);
                      next();
                    })
                    .catch((err) => {
                      logger.error(err);
                    });
                } else {
                  logger.info('Completed batch processing');
                }
              };

              // kick off batch process
              next();

              // logger.debug(companyNames);
              res.status(200).send(`Creating location search cache for ${location}`);
            }
          })
          .catch((err) => {
            logger.error(err);
          });
      } else {
        logger.error('Location not found');
        res.status(404).send('Location not found');
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send('Error creating search cache');
    });
});

app.post('/searchCacheTest', (req, res) => {
  if (!req.body.location) {
    res.status(400).send('Err: no location supplied');
  }
  mongo.getSearchCacheByLocation(req.body.location)
    .then((result) => {
      if (result) {
        logger.info(JSON.parse(result.searchCache));
        res.status(200).send(JSON.parse(result.searchCache));
      } else {
        logger.error('search cache not found');
        res.status(404).send('search cache not found');
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send('Error requesting location');
    });
});

app.post('/matchMapsData', (req, res) => {
  if (!req.body.location) {
    res.status(400).send('Err: no location supplied');
  }
  mongo.matchAddressToCompanies(req.body.location)
    .then(() => {
      res.status(200).send('OK');
    })
    .catch((err) => {
      logger.error(err);
      res.status(400).send('Something went wrong in matchMapsData');
    });
});

// smaller subset for testing
app.post('/downloadCrunchbase100', (req, res) => {
  let { location } = req.body;
  logger.info('Querying location: ', location);
  axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
    params: {
      locations: location,
      organization_types: 'company',
      user_key: process.env.CRUNCHBASE_KEY,
    },
  })
    .then(result => mongo.saveCrunchbaseCompanies(result.data, location))
    .then(() => {
      logger.info('Success writing companies to db');
      res.status(201).send(JSON.stringify('Success writing companies to db'));
    })
    .catch((err) => {
      logger.error(err);
      res.status(404).send(JSON.stringify('Error retrieving from crunchbase'));
    });
});

app.post('/downloadAllCrunchbase', (req, res) => {
  let { location } = req.body;
  logger.info('Querying location: ', location);
  let NUM_PAGES = 1;
  axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
    params: {
      locations: location,
      organization_types: 'company',
      user_key: process.env.CRUNCHBASE_KEY,
    },
  })
    .then((result) => {
      if (result.data.data.paging.number_of_pages > 1) {
        NUM_PAGES = result.data.data.paging.number_of_pages;
        logger.info('Num of result pages: ', NUM_PAGES);
        for (let pageNum = 1; pageNum <= NUM_PAGES; pageNum++) {
          axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
            params: {
              locations: location,
              organization_types: 'company',
              page: pageNum,
              user_key: process.env.CRUNCHBASE_KEY,
            },
          })
            .then(page => mongo.saveCrunchbaseCompanies(page.data, location))
            .then(() => {
              logger.info(`Successfully pulled data into db: page ${pageNum} of ${NUM_PAGES}`);
            })
            .catch((err) => {
              logger.error(err);
            });
        }
        res.status(201).send(JSON.stringify('Writing companies to db...'));
      } else {
        logger.info('downloadAll fell through to single case');
        mongo.saveCrunchbaseCompanies(result.data, location)
          .then(() => {
            logger.info('Successfully pulled data into db');
            res.status(201).send(JSON.stringify('Success writing companies to db'));
          })
          .catch((err) => {
            logger.error(err);
            res.status(500).send(JSON.stringify(err.message));
          });
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(404).send('Error retrieving from crunchbase');
    });
});

app.post('/companies', (req, res) => {
  let { location } = req.body;
  if (!location) {
    res.status(400).send('Err: no location supplied');
  }
  mongo.checkCollections()
    .then((collections) => {
      let found = false;
      collections.forEach((collection) => {
        if (collection.name === 'companies') {
          found = true;
        }
      });
      if (found) {
        logger.info('Valid companies found, continuing');
        return mongo.getCompanies(location);
      } else {
        throw new Error('Uh oh, no companies in the database...');
      }
    })
    .then((results) => {
      if (!results.length) logger.error('No companies found for ', location);
      res.status(200).send(JSON.stringify(results));
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send(JSON.stringify(err.message));
    });
});

app.get('/checkCollections', (req, res) => {
  mongo.checkCollections()
    .then((collections) => {
      logger.info(collections);
      res.status(200).send(collections);
    })
    .catch((err) => {
      logger.error(err);
      res.status(400).send(err);
    });
});

app.get('/googleMapsAPIKey', (req, res) => {
  if (process.env.GOOGLE_MAPS_KEY) {
    res.status(200).send(process.env.GOOGLE_MAPS_KEY);
  } else {
    res.status(500).send('Err: no valid maps API key found');
  }
});

// app.get('/googleMapsInfo', (req, res) => {
//   // google maps API test
//   axios.get('https://maps.googleapis.com/maps/api/place/photo', {
//     params: {
//       maxWidth: 400,
//       photoreference: 'CmRaAAAAu1OI71Feg5NFCFp8_4YYlGwkUaZAqAJeMokzT56HGYfVgnbzYXVr36-9vD8j2GWlHFpADvKCVjMy8QZOmGRqqQ_y5g_uFOtikJll7YsxkRMqghgQXYToLeLO7Az-m3N1EhDjr8VbVmrtIWEVH9CpeDFnGhSkwlsimFfN7cBTiZjMXAyQ-dcfOQ',
//       key: process.env.GOOGLE_MAPS_KEY,
//     },
//     // responseType: 'image/jpeg',
//   })
//     .then((results) => {
//       // logger.info(results.data);
//       // results.data.pipe(fs.createWriteStream('test.jpg'))
//       res.status(200).send('Server will write image data');
//     })
//     .catch((err) => {
//       logger.error(err);
//       res.status(400).send(err);
//     });
// });

app.listen(PORT, () => {
  logger.info('listening on port: ', PORT);
});

