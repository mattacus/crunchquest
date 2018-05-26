const express = require('express');
const bodyParser = require('body-parser');
const PORT = process.env.PORT || 3000;
require('dotenv').config()

// UNCOMMENT THE DATABASE YOU'D LIKE TO USE
// var items = require('../database-mysql');
// const items = require('../database-mongo');

const app = express();

// UNCOMMENT FOR REACT
app.use(express.static(`${__dirname}/../react-client/dist`));

// UNCOMMENT FOR ANGULAR
// app.use(express.static(__dirname + '/../angular-client'));
// app.use(express.static(__dirname + '/../node_modules'));

app.get('/items', (req, res) => {
  items.selectAll((err, data) => {
    if(err) {
      res.sendStatus(500);
    } else {
      res.json(data);
    }
  });
});

app.listen(PORT, () => {
  console.log('listening on port 3000!');
  console.log('SECRET MESSAGE: ', process.env.SECRET_MESSAGE);
});

