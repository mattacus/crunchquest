import React from 'react';
import { Menu, MenuLabel, MenuLink, MenuList } from 'bloomer';
import CompanyListItem from './CompanyListItem.jsx';

class CompanyList extends React.Component {

  render() {
    return (
    <Menu>
      <MenuLabel>Companies</MenuLabel>
      <MenuList>
        {this.props.items.map((item) => {
          let opts = {};
            if (item._id === this.props.selectedCompany._id) {
            opts.isActive = true;
          } else {
            opts.isActive = false;
          }
          return (
            <CompanyListItem key={item._id} item={item} {...opts}
            handleCompanyClick={this.props.handleCompanyClick}
            />
          );
        })}
      </MenuList>
    </Menu>
    );
  }
}

export default CompanyList;
