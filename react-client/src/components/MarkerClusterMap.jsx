import React from 'react';
import ReactDOM from 'react-dom';

const fetch = require('isomorphic-fetch');
const { compose, withProps, withHandlers } = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require('react-google-maps');
const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');

const MarkerClusterMap = compose(
  withProps(props => ({
    googleMapURL: `https://maps.googleapis.com/maps/api/js?key=AIzaSyADrYfzRnMrOQ7DrH3oCDYOFs7GLBAX4eM&v=3.exp&libraries=geometry,drawing,places`,
    loadingElement: <div style={{ height: '100%' }} />,
    containerElement: <div style={{ height: '920px' }} />,
    mapElement: <div style={{ height: '100%' }} />,
  })),
  withHandlers({
    onMarkerClustererClick: () => (markerClusterer) => {
      const clickedMarkers = markerClusterer.getMarkers();
      console.log(`Current clicked markers length: ${clickedMarkers.length}`);
      console.log(clickedMarkers);
    },
  }),
  withScriptjs,
  withGoogleMap,
)(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={{ lat: 30.3079827, lng: -97.8934851 }}
  >
    <MarkerClusterer
      onClick={props.onMarkerClustererClick}
      averageCenter
      enableRetinaIcons
      gridSize={60}
    >
      {props.markers.length ? props.markers.map(marker => (
        <Marker
          key={marker.id}
          position={{ lat: marker.latitude, lng: marker.longitude }}
        />
      )) : <div></div>}
    </MarkerClusterer>
  </GoogleMap>);

export default MarkerClusterMap;
