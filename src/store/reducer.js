import { useReducer } from 'react';
import config from '../data/config.json';
import testInstances from '../data/running.instances.json';
import { extractInstances, getInstanceRawData, initFilters,  setSort } from '../utils';
import {
  FETCH_DATA,
  FILTER_INSTANCES,
  FILTER_UPDATE,
  MODAL_SET_DISPLAY,
  MODAL_SHOW_INSTANCE,
  REFRESH_DATA,
  SORT_OPTIONS_SET
} from './types';

const AWS  = require('aws-sdk');

export const defaultState = {
  loading: true,
  instances: [],
  selectedInstance: '',
  filteredInstances: [],
  filters: initFilters(),
  filtersOrdered : config.filters,
  fields: config.fields,
  modalSettings: {
    display: false,
    pageX: 5,
    pageY: 5,
    instance: {}
  },
  sortOptions: setSort('Name', 'asc'),
  aws: {
    accessKeyId: config.aws.accessKeyId,
    secretAccessKey: config.aws.secretAccessKey
  }
};

const filterInstances = (instances, filters) => {
  const filteredInstances = instances.filter(instance =>{
    let includeInstance = true;

    for (const key in filters) {
      const filter = filters[key];
      const filterField = filter.field;
      const filterValue = filter.currentValue;
      const filterMatch = filter.match;
      if (filterField === "Regions") {
        // The 'Regions' filter is only applied on loading/refresh request in useFetchData, so ignore here.
        continue;
      }

      if (filterMatch !== "regex") {
        if (filterValue && instance[key] !== filterValue) {
          includeInstance = false;
          break;
        }
      } else {
        // Currently just the "Name" field.
        const filterPattern = new RegExp('^' + filterValue);
        if (!filterPattern.test(instance[filterField])) {
          includeInstance = false;
          break;
        }
      }
    }

    return includeInstance;
  });

  return filteredInstances;
}

export const reducer = (state, action) => {
  let payload;
  let instances;
  let filters;
  let newModalSettings;

  switch (action.type) {
    case FETCH_DATA: {
      payload = action.payload;
      instances = state.instances; // We do this to stop test data being over-written, bit hacky! :D

      if (process.env.NODE_ENV === "development") {
        instances = extractInstances(testInstances);
      } else {
        AWS.config.update({
          "accessKeyId": payload.accessKeyId,
          "secretAccessKey": payload.secretAccessKey,
          "region": payload.region
        });

        const ec2 = new AWS.EC2({apiVersion: config.aws.apiVersion});

        const params = {
          DryRun: false
        };

        ec2.describeInstances(params, function(err, data) {
          if(err) {
            console.log("Error", err.stack);
          } else {
            instances = extractInstances(data);
          }
        });
      }

      return { ...state, loading: false, instances };
    }

    case FILTER_INSTANCES: {
      const filteredInstances = filterInstances(state.instances, state.filters);
      return { ...state, filteredInstances };
    }

    case FILTER_UPDATE: {
      payload = action.payload;
      filters = state.filters;

      const filterName = payload.name;
      const filterValue = payload.value;
      const updatedFilter = { ...filters[filterName], currentValue: filterValue };
      const updatedFilters = { ...filters, [filterName]: updatedFilter };

      const filteredInstances = filterInstances(state.instances, updatedFilters);
      return { ...state, filteredInstances, filters: { ...filters, [filterName]: updatedFilter } };
    }

    case MODAL_SET_DISPLAY: {
      payload = action.payload;

      newModalSettings = {
        ...state.modalSettings,
        display: payload.display
      };
      return { ...state, modalSettings: newModalSettings };
    }

    case MODAL_SHOW_INSTANCE: {
      payload = action.payload;

      newModalSettings = {
        ...state.modalSettings,
        display: true,
        pageX: payload.pageX, 
        pageY: payload.pageY,
        instance: getInstanceRawData(state.instances, payload.instanceId)
      };
      return { ...state, selectedInstance: payload.instanceId, modalSettings: newModalSettings };
    }

    case REFRESH_DATA: {
      // This will trigger FETCH_DATA
      return { ...state, loading: true };
    }

    case SORT_OPTIONS_SET: {
      // This will trigger FETCH_DATA
      payload = action.payload;
      return { ...state, sortOptions: setSort(payload.field, payload.order) };
    }

    default: {
      return state;
    }
  }
};

export const initialiseReducer = (props) => {
  const iState = (props && props.initialState) ? props.initialState : defaultState;
  const [state, dispatch] = useReducer(reducer, iState);
  return { state, dispatch };
}