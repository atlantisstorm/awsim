import React, { useContext } from 'react';
import { Context } from "../store/context";
import { SORT_OPTIONS_SET } from '../store/types';

const InstancesHeaderTh = props => {
  const { fieldName } = props;
  const { state, dispatch } = useContext(Context);
  const { sortOptions } = state;

  let extra_class = "";
  let sortIcon = "";

  const displayFieldName = fieldName.replace(/([A-Z])([^A-Z]+)/g, '$1$2 ');
  if (fieldName === sortOptions.field) {
    extra_class = "sorted";
    // sort icon is either black up|down pointing arrow.
    sortIcon = sortOptions.order === "asc" ? '\u25B2' : '\u25BC';
  }

  const onClick = () => {
    const newSortField = fieldName;
    let newSortOrder;
    // if click is on same field then just flip sort order.
    if (newSortField === sortOptions.field) {
      newSortOrder = sortOptions.order === "asc" ? "desc" : "asc";
    } else {
      newSortOrder = "asc";
    }

    dispatch({ type: SORT_OPTIONS_SET, payload: { field: newSortField, order: newSortOrder } });
  };

  return (
    <th data-testid="header-sort" className="{fieldName} {extra_class}" onClick={onClick }>
      <div className="title">
        <div className="left">{displayFieldName}</div>
        <div className="right">{ sortIcon }</div>
      </div>
    </th>
  )
}

export default InstancesHeaderTh;