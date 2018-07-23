# crunchquest
A tool to visually explore CrunchBase companies in your area.

<img width="1680" alt="crunchquest2" src="https://user-images.githubusercontent.com/15896597/43022949-b878df90-8c2e-11e8-9321-769839f98513.png">

**Tools/Technologies Used**

* React
* [React Google Maps](https://tomchentw.github.io/react-google-maps/#introduction)
* [Bulma](https://bulma.io/documentation/overview/) (+ [Bloomer](https://bloomer.js.org/#/documentation/overview/start) HOC's)
* Node + Express
* [Bunyan](https://www.npmjs.com/package/bunyan) for server logging
* MongoDB + Mongoose
* Webpack

# Setup
Run:
```sh
$ npm install

```

Create a .env in the root directory with the following variables:

```sh
PORT  # use whichever port you want
CRUNCHBASE_KEY # free Crunchbase ODM key can be request here: https://data.crunchbase.com/docs/open-data-map
GOOGLE_MAPS_KEY # Use Google Maps Places API
MONGODB_URI # DB will be set up using Mongoose schema.  PM me if you want access to MLab deployment
```

Also, there is a (Maps API - Mapping) API Key embedded in the Google Maps React component that is restricted and will need to be replaced.

Scripts:
```sh
$ npm run react-dev  #for client
$ npm run server-dev #for server 

```
# Usage

**Note: The createSearchCache endpoint will make lots of requests to the Google Maps Places API, sometimes in the thousands.  These requests are not free, use this function with caution!!!**

The endpoints below are not user facing and need to be requested manually, using Postman for instance.  The user application simply loads up the Crunchbase company data by location.

Saving Crunchbase company data, by location:

```sh
POST /downloadAllCrunchbase
body:
{
	"location": [CityName]
}
```

Create a nearby location search cache for all the companies, by location:

```sh
POST /createSearchCache
body:
{
	"location": [CityName]
}
```

Run correlation on Crunchbase data using location search cache, by location:

```sh
POST /matchMapsData
body:
{
	"location": [CityName]
}
```




