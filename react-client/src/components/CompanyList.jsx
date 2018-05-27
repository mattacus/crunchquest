import React from 'react';
import CompanyListItem from './CompanyListItem.jsx';

const CompanyList = props => (
  <div>
    <h4> CompanyList Component </h4>
    There are { props.items.length } items.
    {props.items.map(item => <CompanyListItem item={item}/>)}
  </div>
);

export default CompanyList;
