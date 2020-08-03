jest.mock('aws-sdk');
import { reducer, initialiseReducer } from './reducer';
import filters from '../fixtures/filters';
import extractedInstances from '../fixtures/extracted-instances';
import defaultInstanceRawData from '../fixtures/default-instance-raw-data';
import filteredDevInstances from '../fixtures/filtered-dev-instances';
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

describe('reducer tests', () => {
  it('reducer should be a function', () => {
    expect(reducer).toBeInstanceOf(Function);
  });

  it('should call AWS with correct details when action is FETCH_DATA', () => {
    const initialState = {
      instances: [],
      loading: true,
      instances: extractedInstances
    };
    const payload = {
      region: "fishbone",
      accessKeyId: "access-key-id",
      secretAccessKey: "secret-access-key"
    };

    const state = reducer(initialState, { payload, type: FETCH_DATA });
    expect(AWS.config.update).toHaveBeenCalledTimes(1);
    expect(AWS.config.update).toHaveBeenCalledWith(payload);
  });

  it('should update modalSettings.display when action is FILTER_INSTANCES', () => {
    let state;
    const initialState = { 
      instances: extractedInstances,
      filteredInstances: [],
      filters: filters
    };
    const expectedState = {
      instances: extractedInstances,
      filteredInstances: extractedInstances,
      filters: filters
    };

    // No filters applied so we should get everything back.
    state = reducer(initialState, { type: FILTER_INSTANCES });
    expect(state).toEqual(expectedState);

    initialState.filters['Environment'].currentValue = 'prod';
    state = reducer(initialState, { type: FILTER_INSTANCES });
    expect(state.filteredInstances.length).toBe(25);

    initialState.filters['Name'].currentValue = 'minion';
    state = reducer(initialState, { type: FILTER_INSTANCES });
    expect(state.filteredInstances.length).toBe(5);
  });

  it('should update currentValue for updated filter when action is FILTER_UPDATE', () => {
    const initialState = { 
      filters: {
        Environment: {
          name: 'Environment',
          field: 'Environment',
          type: 'static',
          match: 'exact',
          values: [ 'dev', 'qa', 'prod' ],
          includeEmptyDefaultValue: true,
          currentValue: ''
        }
      },
      instances: extractedInstances
    };
    const expectedState = {
      filters: {
        Environment: {
          name: 'Environment',
          field: 'Environment',
          type: 'static',
          match: 'exact',
          values: [ 'dev', 'qa', 'prod' ],
          includeEmptyDefaultValue: true,
          currentValue: 'dev'
        }
      },
      instances: extractedInstances,
      filteredInstances: filteredDevInstances
    };
    const state = reducer(initialState, {
      type: FILTER_UPDATE,
      payload: {
        name: 'Environment',
        value: 'dev'
      }
    });

    expect(state).toEqual(expectedState);
  });

  it('should update modalSettings.display when action is MODAL_SET_DISPLAY', () => {
    const initialState = { 
      modalSettings: {
        display: false
      }
    };
    const expectedState = {
      modalSettings: {
        display: true
      }
    };
    const state = reducer(initialState, {
      type: MODAL_SET_DISPLAY,
      payload: {
        display: true
      }
    });

    expect(state).toEqual(expectedState);
  });

  it('should update modalSettings.display when action is MODAL_SHOW_INSTANCE', () => {
    const instanceId = 'i-07ae1e2a36d2b88bf';
    const initialState = {
      instances: extractedInstances,
      selectedInstance: '',
      modalSettings: {
        pageX: 0,
        pageY: 0,
        display: true,
        instance: {}
      }
    };
    const expectedState = {
      instances: extractedInstances,
      selectedInstance: instanceId,
      modalSettings: {
        pageX: 100,
        pageY: 90,
        display: true,
        instance: defaultInstanceRawData
      }
    };
    const state = reducer(initialState, {
      type: MODAL_SHOW_INSTANCE,
      payload: {
        pageX: 100,
        pageY: 90,
        instanceId
      }
    });

    expect(state.selectedInstance).toEqual(expectedState.selectedInstance);
    expect(state.modalSettings).toMatchObject(expectedState.modalSettings);
  });

  it('should set loading as true when action if REFRESH_DATA', () => {
    const initialState = { loading: false };
    const expectedState = { loading: true };
    const state = reducer(initialState, {
      type: REFRESH_DATA
    });

    expect(state).toEqual(expectedState);
  });

  it('should adjust sort options when action if SORT_OPTIONS_SET', () => {
    const initialState = { 
      sortOptions: {
        field: "Name",
        order: "asc"
      }
    };
    const expectedState = {
      sortOptions: {
        field: "Environment",
        order: "desc"
      }
    };
    const state = reducer(initialState, {
      type: SORT_OPTIONS_SET,
      payload: {
        field: "Environment",
        order: "desc"
      }
    });

    expect(state).toEqual(expectedState);
  });
});

describe('initialiseReducer tests', () => {
  it('initialiseReducer should be a function', () => {
    expect(initialiseReducer).toBeInstanceOf(Function);
  });
});