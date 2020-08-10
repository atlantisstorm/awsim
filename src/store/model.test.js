jest.mock('aws-sdk');
import extractedInstances from '../fixtures/extracted-instances';
import filters from '../fixtures/filters';
import {
  handleFetchData,
  handleFilterInstances,
  handleFilterUpdate,
  handleModalSetDisplay,
  handleModalShowInstance,
  handleRefreshData,
  handleSortOptionsSet
} from './model';

const AWS  = require('aws-sdk');
   
describe('model tests', () => {
  it('should contain declared functions', () => {
    expect(handleFetchData).toBeInstanceOf(Function);
    expect(handleFilterInstances).toBeInstanceOf(Function);
    expect(handleFilterUpdate).toBeInstanceOf(Function);
    expect(handleModalSetDisplay).toBeInstanceOf(Function);
    expect(handleModalShowInstance).toBeInstanceOf(Function);
    expect(handleRefreshData).toBeInstanceOf(Function);
    expect(handleSortOptionsSet).toBeInstanceOf(Function);
  });

  it('handleFetchData calls AWS with expected parameters ', () => {
    // This test mocks a call to aws-sdk so returned state will be the same as original.
    const state = {
      instances: extractedInstances,
      loading: false
    };
    const expectedState = state;

    const region = "eu-west-1";
    const accessKeyId = "access-key-id";
    const secretAccessKey = "secret-access-key";

    const newState = handleFetchData({
      state,
      accessKeyId,
      secretAccessKey,
      region
    });

    expect(newState).toEqual(expectedState);
    const expectedParams = {
      region,
      accessKeyId,
      secretAccessKey
    };

    expect(AWS.config.update).toHaveBeenCalledTimes(1);
    expect(AWS.config.update).toHaveBeenCalledWith(expectedParams);

    // Loads of other tests...
  });

  it('handleFilterInstances should return expected state', () => {
    let state, newState, expectedState;
    state = {
      instances: extractedInstances,
      filteredInstances: [],
      filters: filters
    };
    newState = handleFilterInstances({ state });

    expectedState = {
      instances: extractedInstances,
      filteredInstances: extractedInstances,
      filters: filters
    };
    expect(newState).toEqual(expectedState);

    state.filters['Environment'].currentValue = 'prod';
    newState = handleFilterInstances({ state });
    expect(newState.filteredInstances.length).toBe(25);

    state.filters['Name'].currentValue = 'minion';
    newState = handleFilterInstances({ state });
    expect(newState.filteredInstances.length).toBe(5);

    // Loads of other tests...
  });

  it('handleFilterUpdate should return expected state', () => {
    //console.log(`defaultState==`, defaultState);
    const state = {
      instances: [],
      filters: {
        Environment: {
          name: 'Environment',
          field: 'Environment',
          type: 'static',
          match: 'exact',
          values: [
            "dev",
            "qa",
            "prod"
          ],
          includeEmptyDefaultValue: true,
          currentValue: ''
        }
      }
    };
    const filterName = "Environment";
    const filterValue = "dev";
    const newState = handleFilterUpdate({ state, filterName, filterValue });

    const expectedState = {
      instances: [],
      filters: {
        Environment: {
          name: 'Environment',
          field: 'Environment',
          type: 'static',
          match: 'exact',
          values: [
            "dev",
            "qa",
            "prod"
          ],
          includeEmptyDefaultValue: true,
          currentValue: 'dev'
        }
      }
    };
    expect(newState).toMatchObject(expectedState);

    // Loads of other tests...
  });

  it('handleModalSetDisplay should return expected state', () => {
    const state = {
      instances: [],
      loading: false,
      modalSettings: {
        display: false,
        pageX: 5,
        pageY: 5,
        instance: {}
      }
    };
    const newState = handleModalSetDisplay({ state, display: true });

    const expectedState = {
        instances: [],
        loading: false,
        modalSettings: {
          display: true,
          pageX: 5,
          pageY: 5,
          instance: {}
        }
    };
    expect(newState).toMatchObject(expectedState);

    // Loads of other tests...
  });

  it
  ('handleModalShowInstance should return expected state', () => {
    const instances = [ 
      {
        InstanceId: "id-1",
        _data: { "fishbone": "redhot1" }
      },
      {
        InstanceId: "id-2",
        _data: { "fishbone": "redhot2" }
      },
      {
        InstanceId: "id-3",
        _data: { "fishbone": "redhot3" }
      }
    ];

    const state = {
      instances,
      loading: false,
      selectedInstance: "",
      modalSettings: {
        display: false,
        pageX: 5,
        pageY: 5,
        instance: {}
      }
    };

    const instanceId = "id-1";
    const pageX = 10;
    const pageY = 15;

    const newState = handleModalShowInstance({ state, instanceId, pageX, pageY });

    const expectedState = {
        instances,
        loading: false,
        selectedInstance: "id-1",
        modalSettings: {
          display: true,
          pageX: 10,
          pageY: 15,
          instance: { "fishbone": "redhot1" }
        }
    };
    expect(newState).toEqual(expectedState);

    // Loads of other tests...
  });

  it('handleRefreshData should return expected state', () => {
    const state = {
      instances: [],
      loading: false
    };
    const newState = handleRefreshData({ state });

    const expectedState = {
      instances: [],
      loading: true
    };
    expect(newState).toMatchObject(expectedState);

    // Loads of other tests...
  });

  it('handleSortOptionsSet should return expected state', () => {
    const state = {
      instances: [],
      loading: false,
      sortOptions: { 
        field: "Name",
        order: "asc"
      }
    };
    const newState = handleSortOptionsSet({ 
      state,
      field: "Environment",
      order: "desc"
     });

    const expectedState = {
      instances: [],
      loading: false,
      sortOptions: { 
        field: "Environment",
        order: "desc"
      }
    };
    expect(newState).toMatchObject(expectedState);

    // Loads of other tests...
  });
});