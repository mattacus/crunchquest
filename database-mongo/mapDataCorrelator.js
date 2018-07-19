const logger = require('../server/logger');

// function to attempt correlation between Crunchbase & Google maps data
let correlateMapData = (placeResults, company, last) => {
  // logger.debug('placeResults: ', placeResults);
  // logger.debug('company: ', company);

  if (!placeResults.length) {
    return undefined;
  }
  let locationDetails = {};
  for (let i = 0; i < placeResults.length; i++) {
    let { searchDetailsCache } = placeResults[i];

    if (searchDetailsCache.website) {
      let mapsName = searchDetailsCache.website.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/.com.*/, '');
      let crunchName = company.homepage_url.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '').replace(/.com.*/, '');
      logger.info(`Website retrieved for ${company.name}: ${searchDetailsCache.website}`);
      logger.info('Maps website post-regex: ', mapsName);
      logger.info('Crunchbase website: ', company.homepage_url);
      logger.info('Crunchbase website post-regex: ', crunchName);
      if (mapsName === crunchName) {
        logger.info(`Found match for ${company.name}!`);
        locationDetails = {
          suggestedAddress: searchDetailsCache.url,
          locationLatResult: String(searchDetailsCache.geometry.location.lat),
          locationLngResult: String(searchDetailsCache.geometry.location.lng),
          placeIDResult: String(searchDetailsCache.id),
        };
        return locationDetails; // return found match
      }
    }
  }
  return null; // nothing found
};

module.exports = correlateMapData;
