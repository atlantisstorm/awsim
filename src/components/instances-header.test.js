import React from 'react';
import { render } from "@testing-library/react";
import InstancesHeader from './instances-header';
import { RenderWithProvider } from './test-helper';

describe('InstancesHeader component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <RenderWithProvider>
        <table>
          <InstancesHeader />
        </table>
      </RenderWithProvider> 
    );

    expect(asFragment()).toMatchSnapshot();
  });
});