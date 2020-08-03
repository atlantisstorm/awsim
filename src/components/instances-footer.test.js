import React from 'react';
import { render } from "@testing-library/react";
import InstancesFooter from './instances-footer';
import { RenderWithProvider } from './test-helper';

describe('InstancesFooter component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <RenderWithProvider>
        <table>
          <InstancesFooter />
        </table>
      </RenderWithProvider>
    );

    expect(asFragment()).toMatchSnapshot();
  });
});