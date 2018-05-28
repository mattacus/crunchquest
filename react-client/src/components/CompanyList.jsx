import React from 'react';
import { Menu, MenuLabel, MenuLink, MenuList } from 'bloomer';
import CompanyListItem from './CompanyListItem.jsx';

class CompanyList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      activeItemID: undefined,
    };
    this.updateActiveItem = this.updateActiveItem.bind(this);
  }

  updateActiveItem(newID) {
    this.setState({ activeItemID: newID });
  }

  render() {
    return (
    <Menu>
      <MenuLabel>Companies</MenuLabel>
      <MenuList>
        {this.props.items.map((item) => {
          let opts = {};
            if (item._id === this.state.activeItemID) {
            opts.isActive = true;
          } else {
            opts.isActive = false;
          }
          return (
            <CompanyListItem key={item._id} item={item} {...opts}
            handleCompanyClick={this.props.handleCompanyClick}
            updateActiveItem={this.updateActiveItem}
            />
          );
        })}
      </MenuList>
    </Menu>
    );
  }
}

export default CompanyList;
