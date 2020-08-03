import React from 'react';
import InstancesHeader from './instances-header';
import InstancesBody from './instances-body';
import InstancesFooter from './instances-footer';

const InstancesTable = () => {
  return (
    <table className="roundedTable">
      <InstancesHeader />
      <InstancesBody />
      <InstancesFooter />
    </table>
  )
}

export default InstancesTable;