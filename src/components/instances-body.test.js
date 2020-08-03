import React from 'react';
import { render } from "@testing-library/react";
import InstancesBody from './instances-body';
import { RenderWithProvider } from './test-helper';

describe('InstancesBody component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <RenderWithProvider>
        <table>
          <InstancesBody />
        </table>
      </RenderWithProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});