# crunchquest
A tool to visually explore CrunchBase companies in your area.

<img width="1680" alt="crunchquest2" src="https://user-images.githubusercontent.com/15896597/43022949-b878df90-8c2e-11e8-9321-769839f98513.png">

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
Scripts:
```sh
$ npm run react-dev  #for client
$ npm run server-dev #for server 

```
# Usage

**Note: The createSearchCache endpoint will make lots of requests to the Google Maps Places API, sometimes in the thousands.  These requests are not free, use this function with caution!!!**
