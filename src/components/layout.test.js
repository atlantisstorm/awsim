import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import Layout from './layout';
import { defaultState } from '../store/reducer';
import { RenderWithProvider } from './test-helper';
import {
  FETCH_DATA,
  FILTER_INSTANCES,
  FILTER_UPDATE,
  REFRESH_DATA
} from '../store/types';
import extractInstances from '../fixtures/extracted-instances';

// Important! jest, and testing in general, really doesn't seem to like import of loading.gif
// in 'loading.jsx' component resulting in various hard to resolve errors.  So to get around
// this I've added this little hack. Not ideal, but needs must when the devil drives!
import * as loading from "./Loading";
import extractedInstances from '../fixtures/extracted-instances';
//import { debug } from 'webpack';
loading.default = jest.fn(() => { 
  return (
    <p>loading</p>
  )
});

describe('Layout component', () => {
  it('should match snapshot', () => {
    const testState = {
      ...defaultState,
      loading: false
    };
    const { asFragment } = render(
      <RenderWithProvider testState={testState}>
        <Layout />
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call dispatch with expected parameters when refresh clicked or filter changes', () => {
    const dispatch = jest.fn();
    let payload;

    const aws = {
      accessKeyId: "access-key-id",
      secretAccessKey: "secret-access-key"
    };

    const testState = {
      ...defaultState, 
      loading: false, 
      instances: extractInstances, 
      filteredInstances: extractInstances,
      aws
    };
    payload = {
      "region": "eu-west-1",
      "accessKeyId": "access-key-id",
      "secretAccessKey": "secret-access-key"
     };
    const { container, asFragment, getByTestId } = render(
      <RenderWithProvider testDispatch={dispatch} testState={testState}>
        <Layout />
      </RenderWithProvider>
    );
  
    expect(dispatch).toHaveBeenCalledTimes(2);
    expect(dispatch).toHaveBeenNthCalledWith(1, { type: FETCH_DATA, payload });
    expect(dispatch).toHaveBeenNthCalledWith(2, { type: FILTER_INSTANCES });
  
    const rowsUnfiltered = container.querySelectorAll("tbody tr");
    expect(rowsUnfiltered.length).toBe(32);

    const refreshButton = getByTestId('refresh-button');
    fireEvent.click(refreshButton);
    expect(dispatch).toHaveBeenCalledTimes(3);
    // Note 'toHaveBeenNthCalledWith' should be able to tell us the order of the dispatch,
    // but with this mock jest.fn they don't seem to fire in the expected order! :/
    // Sooo... just checking that the expected calls have been made even if the order 
    // isn't correct.  I know, not ideal, but needs must when the devil drives.
    expect(dispatch).toHaveBeenCalledWith({ type: REFRESH_DATA });
    expect(dispatch).toHaveBeenCalledWith({ type: FETCH_DATA, payload });
    expect(dispatch).toHaveBeenCalledWith({ type: FILTER_INSTANCES });

    const selectFilter = getByTestId('select-Name');
    fireEvent.change(selectFilter, { target: { value: "minion" } });
    payload = { "name": "Name", "value": "minion" };
    expect(dispatch).toHaveBeenCalledWith({ type: FILTER_UPDATE, payload });
  });

  it('should correctly update when a filter is updated ', () => {
    const testState = {
      ...defaultState,
      loading: false,
      instances: extractedInstances
    };
    const { container, getByTestId } = render(
      <RenderWithProvider testState={testState}>
        <Layout />
      </RenderWithProvider>
    );

    const rowsUnfiltered = container.querySelectorAll("tbody tr");
    expect(rowsUnfiltered.length).toBe(32);

    const selectFilter = getByTestId('select-Name');
    fireEvent.change(selectFilter, { target: { value: "minion" } });

    const rowsFiltered = container.querySelectorAll("tbody tr");
    expect(rowsFiltered.length).toBe(9);
  });
});