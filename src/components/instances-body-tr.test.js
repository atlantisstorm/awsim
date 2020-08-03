import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import InstancesBodyTr from './instances-body-tr';
import extractInstances from '../fixtures/extracted-instances';
import { defaultState } from '../store/reducer';
import { MODAL_SHOW_INSTANCE } from '../store/types';
import { RenderWithProvider } from './test-helper';

describe('InstancesBodyTr component', () => {
  const testState = defaultState

  const sortField = "Name";
  const extractedInstance = extractInstances[0];

  it('should match snapshot', () => {
    const { asFragment } = render(
      <RenderWithProvider testState={testState}>
        <table>
          <tbody>
            <InstancesBodyTr sortField={sortField} instance={extractedInstance} />
          </tbody>
        </table>
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call dispatch with expected parameters when tr row is clicked', () => {
    const dispatch = jest.fn();
    const { getByTestId } = render(
      <RenderWithProvider testDispatch={dispatch} testState={testState}>
        <table>
          <tbody>
            <InstancesBodyTr sortField={sortField} instance={extractedInstance} />
          </tbody>
        </table>
      </RenderWithProvider>
    );

    const showInstanceDetails = getByTestId('show-instance-details');
    fireEvent.click(showInstanceDetails);
    const payload = {
      "instanceId": "",
      "pageX": 0,
      "pageY": 0
    };
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: MODAL_SHOW_INSTANCE, payload });
  });
});