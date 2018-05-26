const express = require('express');
const bodyParser = require('body-parser');
const request = require('request-promise');

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
  res.header(200).send('Success fully got some items!');
});

app.listen(PORT, () => {
  console.log('listening on port: ', PORT);
});

