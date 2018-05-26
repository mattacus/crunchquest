const mongoose = require('mongoose');
const axios = require('axios');

mongoose.connect('mongodb://localhost/crunchquest');

const db = mongoose.connection;

db.on('error', () => {
  console.log('mongoose connection error');
});

db.once('open', () => {
  console.log('mongoose connected successfully');
});

const crunchbaseSchema = new mongoose.Schema({
  name: String,
  profile_image: String,
  short_description: String,
  homepage_url: String,
  linkedin_url: String,
});

const Company = mongoose.model('Company', crunchbaseSchema);

let mongoSave = (rawData) => {
  // format of crunchbase data
  let companyList = rawData.data.items;
  // map to mongo schema
  companyList = companyList.map((company) => {
    const formatted = {
      name: company.name,
      profile_image: company.properties.profile_image_url, // TODO: replace this!
      short_description: company.properties.short_description,
      homepage_url: company.properties.homepage_url,
      linkedin_url: company.properties.linkedin_url,
    };
    return formatted;
  });
  return Company.insertMany(companyList);
};

module.exports.mongoSave = mongoSave;
