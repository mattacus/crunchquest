const mongoose = require('mongoose');
const axios = require('axios');
const Places = require('google-places-web').default;

Places.apiKey = process.env.GOOGLE_MAPS_KEY;
Places.debug = false;

require('dotenv').config();

console.log('Using database: ', process.env.MONGODB_URI);
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
    let placeResults = [];
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
              suggestedAddress = place.url;
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
          address: location,
        };
        let creationPromise = Company.create(dbEntry);
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
          address: undefined,
        };
        let creationPromise = Company.create(dbEntry);
        promisesArray.push(creationPromise);
      });
  });
  return Promise.all(promisesArray);
};

let checkCollections = () => db.db.listCollections().toArray();

module.exports.mongoSave = mongoSave;
module.exports.checkCollections = checkCollections;
module.exports.companies = Company;
