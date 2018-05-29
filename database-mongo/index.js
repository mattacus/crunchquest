const mongoose = require('mongoose');
const axios = require('axios');
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
  // map to mongo schema
  companyList = companyList.map((company) => {
    const formatted = {
      name: company.properties.name,
      profile_image: company.properties.profile_image_url,
      short_description: company.properties.short_description,
      homepage_url: company.properties.homepage_url,
      linkedin_url: company.properties.linkedin_url,
    };
    return formatted;
  });
  return Company.insertMany(companyList);
};

let checkCollections = () => {
  return db.db.listCollections().toArray();
};

module.exports.mongoSave = mongoSave;
module.exports.checkCollections = checkCollections;
module.exports.companies = Company;
