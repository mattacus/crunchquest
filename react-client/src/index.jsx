import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import {
  Container, Box, Hero, HeroHeader, HeroBody, Nav, NavLeft, NavRight, NavCenter, NavItem,
  Icon, Title, Column, Columns, Notification,
} from 'bloomer';
// import './style.scss';
import CompanyList from './components/CompanyList.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: [],
    };
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
        console.log('Got response from server!');
        this.setState({ items: res.data }, () => {
          console.log(this.state.items);
        });
      })
      .catch((err) => {
        console.log('Error retrieving company info from db: ', err);
      });
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
          <Column isSize='2/3'>
            <Notification isColor='success' hasTextAlign='centered'> Company List Column </Notification>
            <CompanyList items={this.state.items} />
          </Column>
          <Column isSize='1/3'>
            <Notification isColor='info' hasTextAlign='centered'> Company Info Column </Notification>
          </Column>
        </Columns>
      </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
