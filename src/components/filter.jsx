import React, { useContext } from 'react';
import { extractDynamicFilterValues } from '../utils';
import { Context } from "../store/context";
import { FILTER_UPDATE } from '../store/types';

const Filter = props => {
  const { filter, instances } = props;
  const filterField = filter.field;
  const { dispatch } = useContext(Context);

  let values = [];
  if (filter.type === "dynamic") {
    // type 'dynamic' are filters taken from unique values in specific fields within instance data.
    values = extractDynamicFilterValues({ filterField, instances });
  } else {
    values = filter.values;
  }

  const combinedOptions = filter.includeEmptyDefaultValue ? ["", ...values] : values;

  const onChange = (event) => {
    const payload = {
      name: event.target.name,
      value: event.target.value
    }
    dispatch({ type: FILTER_UPDATE, payload });
  };

  return (
    <div className="filter">
      <span className="label">{ filter.name }</span>
      <select data-testid={`select-${filterField}`} name={filterField} id={filterField} onChange={onChange}>
        {combinedOptions.map((option, index) => (
            <option key={index} value={option}>{option}</option>
          ))
        }
      </select>
    </div>
  )
}

export default Filter;