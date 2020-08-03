import React from 'react';
import { mount } from 'enzyme';
import ModalDetailsRow from './modal-details-row';

describe('App component', () => {
  it('starts with a count of 0', () => {
    const title = "fishbone";
    const data = "redhot";

    const component = mount(
      <table>
          <tbody>
            <ModalDetailsRow title={title} data={data} />
          </tbody>
      </table>
    );
    expect(component).toMatchSnapshot();
    const titleText = component.find('td:first-child').text();
    expect(titleText).toEqual(title);
    const dataText = component.find('td:last-child').text();
    expect(dataText).toEqual(data);
  });
});