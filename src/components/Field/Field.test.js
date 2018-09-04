import React from 'react';
import { render } from 'enzyme';

import Field from './Field';

describe('<Field />', () => {
  it('should render a text field', () => {
    const wrapper = render(<Field field={{ name: 'Name' }} label="Label" type="text" />);

    const label = wrapper.find('label');
    const input = wrapper.find('input');

    expect(label.text()).toEqual('Label');
    expect(label.prop('for')).toEqual('Name');
    expect(input.prop('id')).toEqual('Name');
    expect(input.get(0).attribs.type).toEqual('text');
  });

  it('should render a password field', () => {
    const wrapper = render(<Field field={{ name: 'Name' }} label="Label" type="password" />);

    const label = wrapper.find('label');
    const input = wrapper.find('input');

    expect(label.text()).toEqual('Label');
    expect(label.prop('for')).toEqual('Name');
    expect(input.prop('id')).toEqual('Name');
    expect(input.get(0).attribs.type).toEqual('password');
  });

  it('should display an error when the field is touched', () => {
    const wrapper = render(
      <Field field={{ name: 'Name', error: 'Error', touched: true }} label="Label" type="text" />);

    const error = wrapper.find('.text-danger');
    expect(error.text()).toEqual('Error');
  });

  it('shouldn\'t display an error when the field is not touched', () => {
    const wrapper = render(
      <Field field={{ name: 'Name', error: 'Error', touched: false }} label="Label" type="text" />);

    const error = wrapper.find('.text-danger');
    expect(error.length).toEqual(0);
  });
});
