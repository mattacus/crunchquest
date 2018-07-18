import React from 'react';
import ReactDOM from 'react-dom';

const fetch = require('isomorphic-fetch');
const {
  compose, withProps, withHandlers, withStateHandlers,
} = require('recompose');
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
  InfoWindow,
} = require('react-google-maps');
const { MarkerClusterer } = require('react-google-maps/lib/components/addons/MarkerClusterer');

class MarkerClusterMap extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: true,
    };

    this.onTitleClick = this.onTitleClick.bind(this);
  }

  onTitleClick(company) {
    this.props.handleMarkerNameClick(company);
  }

  render() {
    return (
      <GoogleMap
        defaultZoom={10}
        defaultCenter={{ lat: 30.3079827, lng: -97.8934851 }}
        center={this.props.center}
      >
        <MarkerClusterer
          onClick={this.props.onMarkerClustererClick}
          averageCenter
          enableRetinaIcons
          gridSize={60}
        >
          {this.props.markers.length ? this.props.markers.map(marker => (
            <Marker
              key={marker.id}
              position={{ lat: marker.latitude, lng: marker.longitude }}
            >
              {this.state.isOpen && <InfoWindow>
                <a onClick={() => { this.onTitleClick(marker.name); }}>{marker.name}</a>
              </InfoWindow>}
            </Marker>
          )) : <div></div>}
        </MarkerClusterer>
      </GoogleMap>
    );
  }
}


export default compose(
  withProps(({
    googleMapURL: 'https://maps.googleapis.com/maps/api/js?key=AIzaSyADrYfzRnMrOQ7DrH3oCDYOFs7GLBAX4eM&v=3.exp&libraries=geometry,drawing,places',
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
)(MarkerClusterMap);
