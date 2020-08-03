import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import InstancesHeaderTh from './instances-header-th';
//import extractInstances from '../fixtures/extracted-instances';
import { defaultState } from '../store/reducer';
import { SORT_OPTIONS_SET } from '../store/types';
import { RenderWithProvider } from './test-helper';
import { extractDynamicFilterValues } from '../utils';

describe('InstancesHeaderTh component', () => {
  //const testState = {
  //  ...defaultState,
  //  loading: false,
  //  instances: extractInstances,
  //  filteredInstances: extractInstances
  //};

  const testState = defaultState;

  it('should match snapshot', () => {
    const fieldName = "Environment";

    const { asFragment } = render(
      <RenderWithProvider testState={testState}>
        <table>
          <thead>
            <tr>
              <InstancesHeaderTh fieldName={fieldName} />
            </tr>
          </thead>
        </table>
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call dispatch with expected field and order when header is clicked', () => {
    const dispatch = jest.fn();
    const fieldName = "Environment";

    const { getByTestId } = render(
      <RenderWithProvider testDispatch={dispatch} testState={testState}>
        <table>
          <thead>
            <tr>
              <InstancesHeaderTh fieldName={fieldName} />
            </tr>
          </thead>
        </table>
      </RenderWithProvider>
    );

    const headerSort = getByTestId('header-sort');
    fireEvent.click(headerSort);
    const payload = {
      field: "Environment",
      order: "asc"
    };
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: SORT_OPTIONS_SET, payload });
  });

  it('should call dispatch with expected parameters when dynamic filter changes', () => {
    const fieldName = "Environment";

    const { container, getByTestId } = render(
      <RenderWithProvider testState={testState}>
        <table>
          <thead>
            <tr>
              <InstancesHeaderTh fieldName={fieldName} />
            </tr>
          </thead>
        </table>
      </RenderWithProvider>
    );

    const headerSort = getByTestId('header-sort');

    const ascIcon = '\u25B2';
    fireEvent.click(headerSort);
    expect(container.innerHTML).toContain(ascIcon);

    const descIcon = '\u25BC';
    fireEvent.click(headerSort);
    expect(container.innerHTML).toContain(descIcon);
  });
});