// Version: MVP1
import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  Container, Content, Box, Hero, HeroHeader, HeroBody,
  Nav, NavLeft, NavRight, NavCenter, NavItem, Button,
  Icon, Title, Subtitle, Notification, Tag,
  Level, LevelItem, LevelLeft, LevelRight, Dropdown,
  DropdownTrigger, DropdownMenu, DropdownItem, DropdownContent,
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
      mapMarkers: [],
      mapLabels: true,
      locations: [],
      activeLocation: {},
      dropdownActive: false,
      dropdownDisabled: false,
      dbEmpty: false,
      shuffling: true,
    };
    this.handleCompanyClick = this.handleCompanyClick.bind(this);
    this.handleMarkerNameClick = this.handleMarkerNameClick.bind(this);
    this.handleDropdownClick = this.handleDropdownClick.bind(this);
    this.handleDropdownItemClick = this.handleDropdownItemClick.bind(this);
    this.getCompanies = this.getCompanies.bind(this);
    this.onChangePage = this.onChangePage.bind(this);
    this.handleShuffleClick = this.handleShuffleClick.bind(this);
  }


  // simple fisher-yates type shuffle
  shuffleList(list) {
    let _list = list.slice();
    let shuffledList = [];
    while (_list.length) {
      let index = Math.floor((Math.random() * _list.length));
      shuffledList.push(_list.splice(index, 1)[0]);
    }

    return shuffledList;
  }

  getCompanies() {
    // disable location changing while company data loads
    this.setState({ dropdownDisabled: true });
    axios.post('/companies', { location: this.state.activeLocation.name })
      .then((res) => {
        console.log('Got response from database: ', res.status);
        if (res.data.length !== 0) {
          let companyList = this.shuffleList(res.data);
          this.setState({
            items: companyList,
            selectedCompany: companyList[0],
            dbEmpty: false,
            dropdownDisabled: false,
            shuffling: false,
          }, () => {
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
          // temporary solution to handle empty database
          this.setState({
            dbEmpty: true,
          });
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    console.log('App mounted');
    return axios.get('locations')
      .then((results) => {
        this.setState({
          locations: results.data.slice(0, 1), // TODO: fix other locations, this temporarily loads just one!
          activeLocation: results.data[0],
        }, () => {
          this.getCompanies();
        });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleCompanyClick(company) {
    this.setState({ selectedCompany: company });
  }

  handleMarkerNameClick(company) {
    let found = this.state.items.find(el => el.name === company);
    console.log(found);
    this.setState({ selectedCompany: found });
  }

  handleDropdownClick() {
    console.log('Dropdown clicked');
    this.setState({
      dropdownActive: !this.state.dropdownActive,
    });
  }

  handleDropdownItemClick(loc) {
    console.log('Item clicked');
    this.setState({
      dropdownActive: !this.state.dropdownActive,
      // activeLocation: loc,
      // items: [],
      // page: [],
      // mapMarkers: [],
      // selectedCompany: {},
    }, () => {
      // this.getCompanies(); // get companies from new location
    });
  }

  handleShuffleClick() {
    this.setState({ shuffling: true }, () => {
      let companyListNew = this.shuffleList(this.state.items);
      this.setState({
        items: companyListNew,
        shuffling: false,
      });
    });
  }

  onChangePage(pageOfItems) {
    this.setState({ page: pageOfItems });
  }

  render() {
    let heroElements = (
      <Hero isColor='dark' isSize='small' >
        <HeroHeader>
        </HeroHeader>
        <HeroBody>
          <Level>
            <Content>
              <LevelLeft>
                <Title hasTextColor='light'>{'CrunchQuest'}</Title>
                <Content>
                  <div>
                    <a href="https://github.com/mattacus/crunchquest">
                      <Tag><Icon className="fab fa-github" /></Tag>
                    </a>
                  </div>
                </Content>
              </LevelLeft>
              <LevelLeft>
                <Content>
                  {/* <p><em>
                  * The react-google-maps components on this page have performance issues that I am aware of and currently investigating.
                  <br />
                  In the meantime, you may need to reload a couple times.
                  </em></p> */}
                </Content>
              </LevelLeft>
            </Content>
            <LevelItem>
              <Button isColor="primary" isLoading={this.state.shuffling} onClick={this.handleShuffleClick}>
                <Icon icon="dice" isSize="small" />
                <span>Randomize List</span>
              </Button>
            </LevelItem>
            <LevelRight>
              <Content>
                <Subtitle isSize={6} hasTextColor='light'><em>{`Currently viewing: ${this.state.activeLocation.name}`}</em></Subtitle>
                <Dropdown isActive={this.state.dropdownActive && !this.state.dropdownDisabled}>
                  <DropdownTrigger onClick={this.handleDropdownClick}>
                    <Button isOutlined>
                      <span>Choose Location</span>
                      <Icon icon="angle-down" isSize="small" />
                    </Button>
                  </DropdownTrigger>
                  <DropdownMenu>
                    <DropdownContent>
                      {this.state.locations.map((location, index) => (
                          <DropdownItem
                            key={index}
                            href="#"
                            onClick={() => this.handleDropdownItemClick(location)}
                          >
                          {location.name}
                          </DropdownItem>
                      ))}
                    </DropdownContent>
                  </DropdownMenu>
                </Dropdown>
              </Content>
            </LevelRight>
          </Level>
        </HeroBody>
      </Hero>
    );
    if (this.state.items.length && !this.state.dbEmpty) {
      return (
        <div>
          {heroElements}
            <div className="tile is-ancestor">
              <div className="tile is-4 is-vertical is-parent">
                <div className="tile is-child">
                  <CompanyList items={this.state.page}
                    selectedCompany={this.state.selectedCompany}
                    handleCompanyClick={this.handleCompanyClick} />
                  <Container isFluid style={{ marginTop: 10 }}>
                    <Pagination items={this.state.items} onChangePage={this.onChangePage} />
                  </Container>
                </div>
                <div className="tile is-child">
                  <CompanyInfo item={this.state.selectedCompany} />
                </div>
              </div>
            <div className="tile is-parent">
              <div className="tile is-child">
                  <MarkerClusterMap
                    markers={this.state.mapMarkers}
                    mapLabels={this.state.mapLabels}
                    handleMarkerNameClick={this.handleMarkerNameClick}
                    cityCenter={this.state.activeLocation.centerCoords}
                    center={this.state.selectedCompany.address ? {
                        lat: Number(this.state.selectedCompany.location_lat),
                        lng: Number(this.state.selectedCompany.location_long),
                    } : {
                        lat: Number(this.state.activeLocation.centerCoords.lat),
                        lng: Number(this.state.activeLocation.centerCoords.lng),
                    }}
                  />
                </div>
              </div>
            </div>
        </div>
      );
    } else if (this.state.dbEmpty) {
      return (
        <div>
          {heroElements}
          <Level>
            <LevelItem>
              <Title isSize={2} hasTextColor='light'>
              {`Err: no companies in db for ${this.state.activeLocation.name}`}
              </Title>
            </LevelItem>
          </Level>
        </div>
      );
    } else { // loading view
      return (
        <div>
          {heroElements}
          <Level>
            <LevelItem>
              <Title isSize={2} hasTextColor='light'>
                {`Loading companies in ${this.state.activeLocation.name}`}
              </Title>
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
