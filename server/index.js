const express = require('express');
const bodyParser = require('body-parser');
const db = require('../database-mongo');
const fs = require('fs');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
require('dotenv').config();

const items = require('../database-mongo');

const app = express();

// MIDDLEWARES
app.use(express.static(`${__dirname}/../react-client/dist`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.post('/download', (req, res) => {
  console.log('Querying location: ', req.body.location);
  axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
    params: {
      locations: req.body.location,
      user_key: process.env.CRUNCHBASE_KEY,
    },
  })
    .then((result) => {
      db.mongoSave(result.data)
        .then(() => {
          console.log('Successfully pulled data into db');
          res.header(201).send(JSON.stringify('Success writing companies to db'));
        })
        .catch((err) => {
          console.log('Error writing to db: ', err.message);
          res.header(500).send(JSON.stringify(err.message));          
        });
    })
    .catch((err) => {
      console.log('Error: ', err);
      res.header(404).send(JSON.stringify('Error retrieving from crunchbase'));
    });
});

app.get('/companies', (req, res) => {
  db.companies.find().exec()
    .then((results) => {
      res.header(200).send(JSON.stringify(results));
    })
    .catch((err) => {
      console.log('Error fetching companies from db', err.message);
      res.header(500).send(JSON.stringify(err.message));
    });
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
      res.header(200).send('Server will write image data');
    })
    .catch((err) => {
      console.log('Error fetching image data', err);
      res.header(400).send(err);      
    });
});

app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});

