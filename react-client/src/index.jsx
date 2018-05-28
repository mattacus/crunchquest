import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  Container, Content, Box, Hero, HeroHeader, HeroBody,
  Nav, NavLeft, NavRight, NavCenter, NavItem, Button,
  Icon, Title, Subtitle, Column, Columns, Notification,
  Level, LevelItem, LevelLeft, LevelRight,
} from 'bloomer';

// import fs from 'fs';
// import path from 'path';
import CompanyList from './components/CompanyList.jsx';
import CompanyInfo from './components/CompanyInfo.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
      selectedCompany: {},
      testPhoto: '',
    };
    this.handleCompanyClick = this.handleCompanyClick.bind(this);
    this.refreshDatabase = this.refreshDatabase.bind(this);
    this.getCompanies = this.getCompanies.bind(this);
  }

  refreshDatabase() {
    // Download new company data
    axios.post('/download', { location: 'Austin' })
      .then((res) => {
        console.log(res.data);
        this.getCompanies();
      })
      .catch((err) => {
        console.log('Error requesting new company data: ', err);
      });
  }

  getCompanies() {
    axios.get('/companies')
      .then((res) => {
        console.log('Got response from database');
        // axios.get('/googleMapsInfo')
        //   .then((image) => {
        //     console.log(image.data);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     throw err;
        //   });
        if (res.data.length !== 0) {
          this.setState({ items: res.data, selectedCompany: res.data[0] }, () => {
            console.log('Companies loaded into app state');
          });
        } else {
          console.log('Database is empty, populating');
          this.refreshDatabase();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  }

  componentDidMount() {
    console.log('App mounted');
    this.getCompanies();
  }

  handleCompanyClick(company) {
    this.setState({ selectedCompany: company });
  }

  render() {
    return (
      <div>
        <Hero isColor='dark' isSize='small' isBold='true'>
          <HeroHeader>
          </HeroHeader>
          <HeroBody>
              <Level>
                <LevelLeft>
                  <Content>
                    <Title>CrunchQuest</Title>
                    <Subtitle isSize={6}><em>alpha</em></Subtitle>
                  </Content>
                </LevelLeft>
                <LevelRight>
                  <Button isColor='light' isOutlined
                  onClick={this.getCompanies}>
                  Refresh Companies</Button>
                </LevelRight>
              </Level>
          </HeroBody>
        </Hero>
        <Columns isCentered>
          <Column isSize='1/3'>
            <CompanyList items={this.state.items} handleCompanyClick={this.handleCompanyClick} />
          </Column>
          <Column isSize='2/3'>
            <CompanyInfo item={this.state.selectedCompany} />
          </Column>
        </Columns>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
