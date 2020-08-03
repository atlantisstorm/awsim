import React, { useContext } from 'react';
import InstancesBodyTr from './instances-body-tr';
import { compare } from '../utils';
import { Context } from "../store/context";

const InstancesBody = () => {
  const { state } = useContext(Context);
  const { filteredInstances, sortOptions } = state;
  return (
    <tbody>
      {filteredInstances.sort(compare(sortOptions.field, sortOptions.order)).map((instance, index) => (
          <InstancesBodyTr
            key={index}
            instance={instance}
            sortField={sortOptions.field}
          />
        ))
      }
    </tbody>
  )
}

export default InstancesBody;