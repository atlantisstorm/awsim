import config from '../data/config.json';
import testInstances from '../data/running.instances.json';
import { extractInstances, getInstanceRawData, initFilters,  setSort } from '../utils';
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

export const handleFetchData = ({ state, accessKeyId, secretAccessKey, region }) => {
  let instances = state.instances; // We do this to stop test data being over-written, bit hacky! :D
  if (process.env.NODE_ENV === "development") {
    instances = extractInstances(testInstances);
  } else {
    AWS.config.update({
      "accessKeyId": accessKeyId,
      "secretAccessKey": secretAccessKey,
      "region": region
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

export const handleFilterInstances = ({ state }) => {
  const filteredInstances = filterInstances(state.instances, state.filters);
  return { ...state, filteredInstances };
}

export const handleFilterUpdate = ({ state, filterName, filterValue }) => {
  const filters = state.filters;
  const updatedFilter = { ...filters[filterName], currentValue: filterValue };
  const updatedFilters = { ...filters, [filterName]: updatedFilter };
  const filteredInstances = filterInstances(state.instances, updatedFilters);

  return { ...state, filteredInstances, filters: { ...filters, [filterName]: updatedFilter } };    
}

export const handleModalSetDisplay = ({ state, display }) => {
  const newModalSettings = {
    ...state.modalSettings,
    display: display
  };

  return { ...state, modalSettings: newModalSettings };
}

export const handleModalShowInstance = ({ state, instanceId, pageX, pageY}) => {
  const newModalSettings = {
    ...state.modalSettings,
    pageX,
    pageY,
    display: true,    
    instance: getInstanceRawData(state.instances, instanceId)
  };

  return { ...state, selectedInstance: instanceId, modalSettings: newModalSettings };
}

export const handleRefreshData = ({ state }) => {
  return { ...state, loading: true };
}

export const handleSortOptionsSet = ({ state, field, order }) => {
  return { ...state, sortOptions: setSort(field, order) };
}

export const Model = {
  handleFetchData,
  handleFilterInstances,
  handleFilterUpdate,
  handleModalSetDisplay,
  handleModalShowInstance,
  handleRefreshData,
  handleSortOptionsSet
};

export default Model;