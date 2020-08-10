import React from 'react';
import { render, fireEvent } from "@testing-library/react";
import ModalShowInstanceDetails from './modal-show-instance-details';
import defaultInstanceRawData from '../fixtures/default-instance-raw-data';
import { defaultState } from '../store/model';
import { MODAL_SET_DISPLAY } from '../store/types';
import { RenderWithProvider } from './test-helper';

describe('ModalShowInstanceDetails component', () => {
  const testState = {
    modalSettings: {
      ...defaultState.modalSettings,
      instance: {
        ...defaultInstanceRawData,
        Tags: [
          { Key: "Tag1", Value: "Value1" },
          { Key: "Tag2", Value: "Value2" },
          { Key: "Tag3", Value: "Value3" }
        ],
        IamInstanceProfile: { Id: "Id value", Arm: "Arm value" }
      }
    }
  };

  it('should match snapshot', () => {
    const { asFragment } = render(
      <RenderWithProvider testState={testState}>
        <ModalShowInstanceDetails />
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });

  it('should call dispatch to make modal display false on click event', () => {
    const dispatch = jest.fn();
    const { getByTestId } = render(
      <RenderWithProvider testDispatch={dispatch} testState={testState}>
        <ModalShowInstanceDetails />
      </RenderWithProvider>
    );

    const modalClose = getByTestId('modal-close');
    fireEvent.click(modalClose);
    const payload = { "display": false };
    expect(dispatch).toHaveBeenCalledTimes(1);
    expect(dispatch).toHaveBeenCalledWith({ type: MODAL_SET_DISPLAY, payload });
  });

  it('should contain expected section headers, field title and values', () => {
    const { container, asFragment } = render(
      <RenderWithProvider testState={testState}>
        <ModalShowInstanceDetails />
      </RenderWithProvider>
    );

    // Check section headers are in place.
    expect(container.innerHTML).toContain('<td colspan="2" class="header">General</td>');
    expect(container.innerHTML).toContain('<tr><td class="title">Architecture</td><td class="data">x86_64</td></tr>');

    expect(container.innerHTML).toContain('<td colspan="2" class="header">Tags</td>');
    expect(container.innerHTML).toContain('<tr><td class="title">Tag1</td><td class="data">Value1</td></tr>');

    expect(container.innerHTML).toContain('<td colspan="2" class="header">Iam Instance Profile</td>');
    expect(container.innerHTML).toContain('<tr><td class="title">Id</td><td class="data">Id value</td></tr>');

  });
});