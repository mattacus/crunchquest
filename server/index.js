const logger = require('./logger');
const express = require('express');
const bodyParser = require('body-parser');
const mongo = require('../database-mongo/dbHelpers.js');
const fs = require('fs');
const axios = require('axios');
const morgan = require('morgan');
require('dotenv').config();

const PORT = process.env.PORT || 3000;

const app = express();

// MIDDLEWARES
app.use(express.static(`${__dirname}/../react-client/dist`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());
app.use(morgan('dev'));

app.post('/download', (req, res) => {
  console.log('Querying location: ', req.body.location);
  axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
    params: {
      locations: req.body.location,
      organization_types: 'company',
      user_key: process.env.CRUNCHBASE_KEY,
    },
  })
    .then((result) => {
      mongo.mongoSave(result.data)
        .then(() => {
          console.log('Successfully pulled data into db');
          res.status(201).send(JSON.stringify('Success writing companies to db'));
        })
        .catch((err) => {
          console.log('Error writing to db: ', err.message);
          res.status(500).send(JSON.stringify(err.message));
        });
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.status(404).send(JSON.stringify('Error retrieving from crunchbase'));
    });
});

app.post('/createSearchCache', (req, res) => {
  if (!req.body.location) {
    res.status(400).send('Err: no location supplied');
  }
  mongo.getLocationInfo(req.body.location)
    .then((result) => {
      if (result) {
        helpers.createLocationSearchCache(result, [{ name: 'GOAT' }]);
        res.status(200).send('Creating location search cache...');
      } else {
        logger.error('Location not found');
        res.status(404).send('Location not found');
      }
    })
    .catch((err) => {
      logger.error(err);
      res.status(500).send('Error requesting location');
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

app.post('/downloadAll', (req, res) => {
  // TODO: get all paginated results
  let first = true;
  console.log('Querying location: ', req.body.location);
  let NUM_PAGES = 1;
  axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
    params: {
      locations: req.body.location,
      organization_types: 'company',
      user_key: process.env.CRUNCHBASE_KEY,
    },
  })
    .then((result) => {
      if (result.data.data.paging.number_of_pages > 1) {
        NUM_PAGES = result.data.data.paging.number_of_pages;
        console.log('Num of result pages: ', NUM_PAGES);
        for (let pageNum = 1; pageNum <= NUM_PAGES; pageNum++) {
          axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
            params: {
              locations: req.body.location,
              organization_types: 'company',
              page: pageNum,
              user_key: process.env.CRUNCHBASE_KEY,
            },
          })
            .then((page) => {
              mongo.mongoSave(page.data)
                .then(() => {
                  console.log(`Successfully pulled data into db: page ${pageNum} of ${NUM_PAGES}`);
                })
                .catch((err) => {
                  console.log('Error writing to db: ', err.message);
                });
            })
            .catch((err) => {
              console.log(err);
            });
        }
        res.status(201).send(JSON.stringify('Writing companies to db...'));
      } else {
        console.log('downloadAll fell through to single case');
        mongo.mongoSave(result.data)
          .then(() => {
            console.log('Successfully pulled data into db');
            res.status(201).send(JSON.stringify('Success writing companies to db'));
          })
          .catch((err) => {
            console.log('Error writing to db: ', err.message);
            res.status(500).send(JSON.stringify(err.message));
          });
      }
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.status(404).send(JSON.stringify('Error retrieving from crunchbase'));
    });
});

app.get('/companies', (req, res) => {
  mongo.checkCollections()
    .then((collections) => {
      if (collections) {
        console.log('Valid database found, continuing');
        mongo.companies.find().exec()
          .then((results) => {
            res.status(200).send(JSON.stringify(results));
          })
          .catch((err) => {
            console.log('Error fetching companies from db', err.message);
            res.status(500).send(JSON.stringify(err.message));
          });
      } else {
        res.status(500).send('{[]}');
      }
    })
    .catch((err) => {
      console.log(err);
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

app.get('/googleMapsInfo', (req, res) => {
  // google maps API test
  axios.get('https://maps.googleapis.com/maps/api/place/photo', {
    params: {
      maxWidth: 400,
      photoreference: 'CmRaAAAAu1OI71Feg5NFCFp8_4YYlGwkUaZAqAJeMokzT56HGYfVgnbzYXVr36-9vD8j2GWlHFpADvKCVjMy8QZOmGRqqQ_y5g_uFOtikJll7YsxkRMqghgQXYToLeLO7Az-m3N1EhDjr8VbVmrtIWEVH9CpeDFnGhSkwlsimFfN7cBTiZjMXAyQ-dcfOQ',
      key: process.env.GOOGLE_MAPS_KEY,
    },
    // responseType: 'image/jpeg',
  })
    .then((results) => {
      // console.log(results.data);
      // results.data.pipe(fs.createWriteStream('test.jpg'))
      res.status(200).send('Server will write image data');
    })
    .catch((err) => {
      console.log('Error fetching image data', err);
      res.status(400).send(err);
    });
});

app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});

