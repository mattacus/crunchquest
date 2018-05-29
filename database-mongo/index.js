const mongoose = require('mongoose');
const axios = require('axios');
const Places = require('google-places-web').default;

Places.apiKey = process.env.GOOGLE_MAPS_KEY;
Places.debug = false;

require('dotenv').config();

console.log('Using database: ', process.env.MONGODB_URI)
mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const crunchbaseSchema = new mongoose.Schema({
  name: { type: String, index: { unique: true } },
  profile_image: String,
  short_description: String,
  homepage_url: String,
  linkedin_url: String,
  address: String,
});

const Company = mongoose.model('Company', crunchbaseSchema);

let mongoSave = (rawData) => {
  // format of crunchbase data
  let companyList = rawData.data.items;
  let promisesArray = [];
  // map to mongo schema
  companyList = companyList.forEach((company) => {
    // attempt to correlate google maps object with crunchbase url
    Places.nearbysearch({ 
      location: '30.3079827, -97.8934851', // center of Austin
      keyword: company.properties.name,
      radius: '30000',
    })
      .then(places => places[0] || {})
      .then(place => (place.place_id ? Places.details({ placeid: place.place_id }) : {}))
      .then((details) => {
        // TODO: go look through each place, use url regex 
        let suggestedAddress;
        if (details.website === company.properties.homepage_url) {
          suggestedAddress = details.url;
        } else {
          suggestedAddress = '';
        }
        console.log(`Website retrieved for ${company.properties.name}: ${details.website}`);
        const dbEntry = {
          name: company.properties.name,
          profile_image: company.properties.profile_image_url,
          short_description: company.properties.short_description,
          homepage_url: company.properties.homepage_url,
          linkedin_url: company.properties.linkedin_url,
          address: suggestedAddress,
        };
        let creationPromise = Company.create(dbEntry);
        promisesArray.push(creationPromise);
      })
      .catch((err) => {
        console.log(`Error in Query ${company.properties.name}: ${err}`);
        // this is an ugly hack, please fix soon
        const dbEntry = {
          name: company.properties.name,
          profile_image: company.properties.profile_image_url,
          short_description: company.properties.short_description,
          homepage_url: company.properties.homepage_url,
          linkedin_url: company.properties.linkedin_url,
          address: undefined,
        };
        let creationPromise = Company.create(dbEntry);
        promisesArray.push(creationPromise);
      });
  });
  return Promise.all(promisesArray);
};

let checkCollections = () => {
  return db.db.listCollections().toArray();
};

module.exports.mongoSave = mongoSave;
module.exports.checkCollections = checkCollections;
module.exports.companies = Company;
