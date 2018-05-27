import React from 'react';
import { MenuLink } from 'bloomer';


const CompanyListItem = props => (
    <li key={props.item._id}>
      <MenuLink>{props.item.name}</MenuLink>
    </li>
);

export default CompanyListItem;
