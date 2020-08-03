import React from 'react';
import { render } from "@testing-library/react";
import App from './App';

// Important! jest, and testing in general, really doesn't seem to like import of loading.gif
// in 'loading.jsx' component resulting in various hard to resolve errors.  So to get around
// this I've added this little hack. Not ideal, but needs must when the devil drives!
import * as loading from "./Loading";
loading.default = jest.fn(() => { 
  return (
    <p>loading</p>
  )
});

describe('App component', () => {
  it('should match snapshot', () => {
    const { asFragment } = render(<App />);
    expect(asFragment()).toMatchSnapshot();
  });
});