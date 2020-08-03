import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import Filter from './filter';
import extractInstances from '../fixtures/extracted-instances';
import { defaultState } from '../store/reducer';
import { FILTER_UPDATE } from '../store/types';
import { RenderWithProvider } from './test-helper';

describe('Filter component', () => {
  const testState = {
    ...defaultState,
    loading: false,
    instances: extractInstances,
    filteredInstances: extractInstances
  };

  it('should match snapshot', () => {
    const expectedFilter = {
      name: 'Name',
      field: 'Name',
      type: 'static',
      match: 'regex',
      values: [
        'ftp',
        'image',
        'loghost',
        'minion',
        'rx',
        'sql',
        'tx',
        'workhorse'
      ],
      includeEmptyDefaultValue: true
    };

    const filter = testState.filtersOrdered[0];
    expect(filter).toMatchObject(expectedFilter);

    const { asFragment } = render(
      <RenderWithProvider>
        <Filter filter={filter} instances={testState.instances} />
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call dispatch with expected parameters when static filter changes', () => {
    const dispatch = jest.fn();
    const filter = testState.filtersOrdered[0];
    const { getByTestId } = render(
      <RenderWithProvider testDispatch={dispatch}>
        <Filter  filter={filter} instances={testState.instances} />
      </RenderWithProvider>
    );

    const selectFilter = getByTestId('select-Name');
    fireEvent.change(selectFilter, { target: { value: "minion" } });
    const payload = { "name": "Name", "value": "minion" };
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: FILTER_UPDATE, payload });
  });

  it('should call dispatch with expected parameters when dynamic filter changes', () => {
    const dispatch = jest.fn();
    const filter = testState.filtersOrdered[4];

    const expectedFilter = {
      name: 'Image Id',
      field: 'ImageId',
      type: 'dynamic',
      match: 'exact',
      values: [],
      includeEmptyDefaultValue: true
    };

    expect(filter).toMatchObject(expectedFilter);

    const { asFragment, getByTestId } = render(
      <RenderWithProvider testDispatch={dispatch}>
        <Filter  filter={filter} instances={testState.instances} />
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();

    const selectFilter = getByTestId('select-ImageId');
    const imageId = "ami-5442621417d9c502d";
    fireEvent.change(selectFilter, { target: { value: imageId } });
    const payload = { "name": "ImageId", "value": imageId };
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: FILTER_UPDATE, payload });
  });
});