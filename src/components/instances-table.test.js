import React from 'react';
import { render } from "@testing-library/react";
import InstanceTable from './instances-table';
import { RenderWithProvider } from './test-helper';

describe('InstanceTable component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(
      <RenderWithProvider>
        <InstanceTable />
      </RenderWithProvider>
    );
    expect(asFragment()).toMatchSnapshot();
  });
});