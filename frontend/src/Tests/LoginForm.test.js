/* eslint-disable */
import { createShallow } from '@material-ui/core/test-utils';
import React from 'react';
import Button from '@material-ui/core/Button';
import Textfield from '@material-ui/core/Textfield';
import LoginForm from '../components/LoginForm';

describe('LoginForm', () => {
  const noop = () => {};
  let shallow;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('loginForm should have two buttons', () => {
    const wrapper = shallow(<LoginForm setToken={noop} />);
    expect(wrapper.find(Button)).toHaveLength(2);
  });

  it('first button has text "Log In" and second button has text "Register"', () => {
    const wrapper = shallow(<LoginForm setToken={noop} />);
    expect(wrapper.find(Button).at(0).text()).toEqual('Log In');
    expect(wrapper.find(Button).at(1).text()).toEqual('Register');
  });

  it('should have input for email and password and corresponding aria-labels for each input', () => {
    const wrapper = shallow(<LoginForm setToken={noop} />);
    expect(wrapper.find(Textfield).at(0).prop('inputProps')['aria-label']).toEqual('email input');
    expect(wrapper.find(Textfield).at(1).prop('inputProps')['aria-label']).toEqual('password input');
  });
});
