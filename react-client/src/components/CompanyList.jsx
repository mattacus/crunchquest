import React from 'react';
import { Menu, MenuLabel, MenuLink, MenuList } from 'bloomer';
import CompanyListItem from './CompanyListItem.jsx';

const CompanyList = props => (
  <Menu>
    <MenuLabel>Companies</MenuLabel>
    <MenuList>
      {props.items.map(item => <CompanyListItem item={item} />)}
    </MenuList>
  </Menu>
);

export default CompanyList;
