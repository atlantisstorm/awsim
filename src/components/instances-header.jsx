import React, { useContext } from 'react';
import InstancesHeaderTh from './instances-header-th';
import { Context } from "../store/context";

const InstancesHeader = () => {
  const { state } = useContext(Context);
  const { fields } = state;

  return (
    <thead>
      <tr>
      {fields.map((fieldName, index) => (
        <InstancesHeaderTh key={index} fieldName={fieldName} />
      ))}
      </tr>
    </thead>
  )
}

export default InstancesHeader;