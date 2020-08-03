import React, { useContext } from 'react';
import { Context } from "../store/context";
const InstancesFooter = () => {
  const { state } = useContext(Context);
  const { fields, filteredInstances } = state;

  return (
    <tfoot>
      <tr>
        <td colSpan={fields.length + 1}>{filteredInstances.length} instances found.</td>
      </tr>
    </tfoot>
  )
}

export default InstancesFooter;