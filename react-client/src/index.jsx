// Version: MVP1
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  Container, Content, Box, Hero, HeroHeader, HeroBody,
  Nav, NavLeft, NavRight, NavCenter, NavItem, Button,
  Icon, Title, Subtitle, Column, Columns, Notification,
  Level, LevelItem, LevelLeft, LevelRight,
} from 'bloomer';
import { ClimbingBoxLoader } from 'react-spinners';

import CompanyList from './components/CompanyList.jsx';
import CompanyInfo from './components/CompanyInfo.jsx';
import Pagination from './components/Pagination.jsx';
import MarkerClusterMap from './components/MarkerClusterMap.jsx';
import './styles/main.scss';


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      page: [],
      selectedCompany: {},
      testPhoto: '',
      mapMarkers: [],
      mapLabels: true,
      searchLocation: 'Austin',
    };
    this.handleCompanyClick = this.handleCompanyClick.bind(this);
    this.handleMarkerNameClick = this.handleMarkerNameClick.bind(this);
    this.getCompanies = this.getCompanies.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.handleToggleMapLabels = this.handleToggleMapLabels.bind(this);
  }

  getCompanies() {
    axios.post('/companies', { location: this.state.searchLocation })
      .then((res) => {
        console.log('Got response from database: ', res.status);
        if (res.data.length !== 0) {
          this.setState({ items: res.data, selectedCompany: res.data[0] }, () => {
            console.log('Companies loaded into app state');
            console.log('Creating markers...');
            let markers = [];
            this.state.items.forEach((item) => {
              if (item.address) {
                markers.push({
                  name: item.name,
                  id: item.place_id,
                  latitude: Number(item.location_lat),
                  longitude: Number(item.location_long),
                });
              }
            });
            this.setState({ mapMarkers: markers });
          });
        } else {
          console.log('Err: Database is empty');
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    console.log('App mounted');
    this.getCompanies();

    // get api key
    // axios.get('googleMapsAPIKey')
    //   .then((res) => {
    //     this.setState({
    //       apiKey: res.data,
    //     });
    //   })
    //   .catch((err) => {
    //     console.log(err);
    //   });
  }

  handleCompanyClick(company) {
    this.setState({ selectedCompany: company });
  }

  handleMarkerNameClick(company) {
    let found = this.state.items.find(el => el.name === company);
    console.log(found);
    this.setState({ selectedCompany: found });
  }

  onChangePage(pageOfItems) {
    this.setState({ page: pageOfItems });
  }

  handleToggleMapLabels() {
    this.setState({ mapLabels: !this.state.mapLabels });
  }

  render() {
    if (this.state.items.length) {
      return (
        <div>
          <Hero isColor='dark' isSize='small' >
            <HeroHeader>
            </HeroHeader>
            <HeroBody>
                <Level>
                  <LevelLeft>
                    <Content>
                      <Title hasTextColor='light'>CrunchQuest</Title>
                    </Content>
                  </LevelLeft>
                  <LevelRight>
                    <Content>
                    <Subtitle isSize={6} hasTextColor='light'><em>{`Currently viewing: ${this.state.searchLocation}`}</em></Subtitle>
                    </Content>
                  </LevelRight>
                </Level>
            </HeroBody>
          </Hero>
            <div className="tile is-ancestor">
              <div className="tile is-4 is-vertical is-parent">
                <div className="tile is-child box">
                  <CompanyList items={this.state.page}
                    selectedCompany={this.state.selectedCompany}
                    handleCompanyClick={this.handleCompanyClick} />
                  <Container isFluid style={{ marginTop: 10 }}>
                    <Pagination items={this.state.items} onChangePage={this.onChangePage} />
                  </Container>
                </div>
                <div className="tile is-child box">
                  <CompanyInfo item={this.state.selectedCompany} />
                </div>
              </div>
              <div className="tile is-parent">
                <div className="tile is-child box">
                  <MarkerClusterMap
                    markers={this.state.mapMarkers}
                    mapLabels={this.state.mapLabels}
                    handleMarkerNameClick={this.handleMarkerNameClick}
                    center={this.state.selectedCompany.address ? {
                        lat: Number(this.state.selectedCompany.location_lat),
                        lng: Number(this.state.selectedCompany.location_long),
                    } : { lat: 30.3079827, lng: -97.8934851 }}
                  />
                </div>
              </div>
            </div>
        </div>
      );
    } else {
      return (
        <div>
          <Hero isColor='dark' isSize='small' >
            <HeroHeader>
            </HeroHeader>
            <HeroBody>
              <Level>
                <LevelLeft>
                  <Content>
                    <Title hasTextColor='light'>CrunchQuest</Title>
                  </Content>
                </LevelLeft>
                <LevelRight>
                  <Content>
                    <Subtitle isSize={6} hasTextColor='light'><em>{`Currently viewing: ${this.state.searchLocation}`}</em></Subtitle>
                  </Content>
                </LevelRight>
              </Level>
            </HeroBody>
          </Hero>
          <Level>
            <LevelItem>
              <Title isSuze={2} hasTextColor='light'>Loading companies from database...</Title>
            </LevelItem>
          </Level>
          <Level>
            <LevelItem>
              <ClimbingBoxLoader
                color={'#1abc9c'}
                size={28}
                loading={this.state.loading}
              />
            </LevelItem>
          </Level>
        </div>
      );
    }
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
