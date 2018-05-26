import React from 'react';
import ReactDOM from 'react-dom';
import axios from 'axios';
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
      <h1>Hello, World!</h1>
      <List items={this.state.items}/>
    </div>
    );
  }
}

ReactDOM.render(<App />, document.getElementById('app'));
