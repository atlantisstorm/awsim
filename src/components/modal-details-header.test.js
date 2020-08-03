import React from 'react';
import { mount } from 'enzyme';
import ModalDetailsHeader from './modal-details-header';

describe('App component', () => {
  it('starts with a count of 0', () => {
    const title = "fishbone";

    const component = mount(
      <table>
          <tbody>
            <ModalDetailsHeader title={title}/>
          </tbody>
      </table>
    );
    expect(component).toMatchSnapshot();
    const text = component.find('td').text();
    expect(text).toEqual(title);
  });
});