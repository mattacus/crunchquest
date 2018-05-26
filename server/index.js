const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const PORT = process.env.PORT || 3000;
require('dotenv').config();

// const items = require('../database-mongo');

const app = express();

// MIDDLEWARES
app.use(express.static(`${__dirname}/../react-client/dist`));
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.get('/items', (req, res) => {
  axios.get('https://api.crunchbase.com/v3.1/odm-organizations', {
    params: {
      locations: 'Austin',
      user_key: process.env.CRUNCHBASE_KEY,
    }
  })
    .then((result) => {
      res.header(200).send(JSON.stringify(result.data));
    })
    .catch((err) => {
      console.log('Error retrieving from crunchbase');
      res.header(400).send(JSON.stringify('Error retrieving from crunchbase'));
    })

});

app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});

