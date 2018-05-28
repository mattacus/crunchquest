import React from 'react';
import { MenuLink } from 'bloomer';

class CompanyListItem extends React.Component {
  constructor(props) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(e) {
    e.preventDefault();
    this.props.handleCompanyClick(this.props.item);
    console.log('You clicked ', this.props.item.name);
  }

  render() {
    return (
      <li key={this.props.item._id}>
        <MenuLink onClick={this.handleClick}>{this.props.item.name}</MenuLink>
      </li>
    );
  }
}

export default CompanyListItem;
