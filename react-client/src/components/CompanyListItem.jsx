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
    this.props.updateActiveItem(this.props.item._id);
  }

  render() {
    let opts = {};
    if (this.props.isActive) { opts.isActive = 'isActive'; }
    return (
      <li>
        <MenuLink onClick={this.handleClick} {...opts}>{this.props.item.name}</MenuLink>
      </li>
    );
  }
}

export default CompanyListItem;
