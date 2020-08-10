import { useReducer } from 'react';
import {
  FETCH_DATA,
  FILTER_INSTANCES,
  FILTER_UPDATE,
  MODAL_SET_DISPLAY,
  MODAL_SHOW_INSTANCE,
  REFRESH_DATA,
  SORT_OPTIONS_SET
} from './types';
import { Model, defaultState } from './model';

export const reducer = (state, action) => {
  let payload;

  switch (action.type) {
    case FETCH_DATA: {
      payload = action.payload;

      return Model.handleFetchData({ 
        state,
        accessKeyId: payload.accessKeyId,
        secretAccessKey: payload.secretAccessKey,
        region: payload.region
       });
    }

    case FILTER_INSTANCES: {
      return Model.handleFilterInstances({ state });
    }

    case FILTER_UPDATE: {
      payload = action.payload;

      return Model.handleFilterUpdate({
        state,
        filterName: payload.name,
        filterValue: payload.value
      });
    }

    case MODAL_SET_DISPLAY: {
      payload = action.payload;

      return Model.handleModalSetDisplay({ state, display: payload.display });
    }

    case MODAL_SHOW_INSTANCE: {
      payload = action.payload;

      return Model.handleModalShowInstance({ 
        state,
        instanceId: payload.instanceId,
        pageX: payload.pageX, 
        pageY: payload.pageY
       });
    }

    case REFRESH_DATA: {
      // This will trigger FETCH_DATA
      return Model.handleRefreshData({ state });
    }

    case SORT_OPTIONS_SET: {
      // This will trigger FETCH_DATA
      payload = action.payload;

      return Model.handleSortOptionsSet({
        state,
        field: payload.field,
        order: payload.order
      });
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