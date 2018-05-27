import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
import { Container, Box, Columns, Column, Button } from 'bloomer';
// import './style.scss';
import List from './components/List.jsx';

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
        console.log('Got response from server: ', res.data);
      })
      .catch((err) => {
        console.log('Error retrieving company info from db: ', err);
      });
  }

  render() {
    return (
    <div>
        <Columns>
          <Button isColor='info' render={
            props => <Column hasTextAlign='centered'><p {...props}>Button</p></Column>
          } />
          <Column>
            <Button isColor='warning' isLoading>isLoading={true}</Button>
          </Column>
          <Column hasTextAlign='centered'>
            <Button isColor='success' isOutlined>isOutlined</Button>
          </Column>
        </Columns>
      <List items={this.state.items}/>
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
