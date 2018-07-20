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

      // lowercase both urls
      let mapsName = searchDetailsCache.website.toLowerCase();
      let crunchName = company.homepage_url.toLowerCase();

      // replace http, www
      mapsName = mapsName.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');
      crunchName = crunchName.replace(/^(?:https?:\/\/)?(?:www\.)?/i, '');

      // replace .com
      mapsName = mapsName.replace(/.com.*/, '');
      crunchName = crunchName.replace(/.com.*/, '');

      // replace other subdomains
      mapsName = mapsName.replace(/.org.*/, '');
      crunchName = crunchName.replace(/.org.*/, '');
      mapsName = mapsName.replace(/.bar.*/, '');
      crunchName = crunchName.replace(/.bar.*/, '');
      mapsName = mapsName.replace(/.ca.*/, '');
      crunchName = crunchName.replace(/.ca.*/, '');

      // remove trailing characters
      let mapsNameLast = mapsName.slice(-1);
      let crunchNameLast = crunchName.slice(-1);
      if (mapsNameLast === '/') {
        mapsName = mapsName.substring(0, mapsName.length - 1);
      }
      if (crunchNameLast === '/') {
        crunchName = crunchName.substring(0, crunchName.length - 1);
      }


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
