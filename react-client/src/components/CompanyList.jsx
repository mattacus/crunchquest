import React from 'react';
import { Menu, MenuLabel, MenuLink, MenuList } from 'bloomer';
import CompanyListItem from './CompanyListItem.jsx';

const CompanyList = props => (
  <Menu>
    <MenuLabel>Companies</MenuLabel>
    <MenuList>
      {props.items.map(item => <CompanyListItem item={item} 
      handleCompanyClick={props.handleCompanyClick}/>)}
    </MenuList>
  </Menu>
);

export default CompanyList;
