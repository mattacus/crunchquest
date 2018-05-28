import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  Container, Box, Hero, HeroHeader, HeroBody, Nav, NavLeft, NavRight, NavCenter, NavItem,
  Icon, Title, Column, Columns, Notification,
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
  }

  componentDidMount() {
    // Download new company data
    // axios.post('/download', { location: 'Austin' })
    //   .then((res) => {
    //     console.log(res.data);
    //   })
    //   .catch((err) => {
    //     console.log('Error requesting new company data: ', err);
    //   });

    axios.get('/companies')
      .then((res) => {
        console.log('Got companies from database!');
        // axios.get('/googleMapsInfo')
        //   .then((image) => {
        //     console.log(image.data);
        //   })
        //   .catch((err) => {
        //     console.log(err);
        //     throw err;
        //   });
        this.setState({ items: res.data, selectedCompany: res.data[0] }, () => {
          console.log(this.state.selectedCompany);
        });
      })
      .catch((err) => {
        console.log(err);
      });
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
            <Container hasTextAlign='centered'>
              <Title>CrunchQuest</Title>
            </Container>
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
