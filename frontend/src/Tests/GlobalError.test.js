/* eslint-disable */
import { createShallow } from '@material-ui/core/test-utils';
import React from 'react';
import Snackbar from '@material-ui/core/Snackbar';
import Alert from '@material-ui/lab/Alert';
import GlobalError from '../components/GlobalError';

describe('LoginForm', () => {
  const noop = () => {};
  let shallow;

  beforeAll(() => {
    shallow = createShallow();
  });

  it('set error text into global error component', () => {
    const open = true; // mock prop
    const wrapper = shallow(<GlobalError handleClose={noop} errMsg="Test Error" open={open} />);
    expect(wrapper.find(Alert).text()).toEqual('Test Error');
  });

  it('test error Alert registers handleClose on close', () => {
    const open = true; // mock prop
    const errMsg = "Test Message"; // mock message
    const handleClose = jest.fn();
    const wrapper = shallow(<GlobalError handleClose={handleClose} errMsg={errMsg} open={open} />);
    wrapper.find(Alert).simulate('close');
    expect(handleClose).toBeCalledTimes(1);
  });

  it('test error SnackBar registers handleClose on close', () => {
    const open = true; // mock prop
    const errMsg = "Test Message"; // mock message
    const handleClose = jest.fn();
    const wrapper = shallow(<GlobalError handleClose={handleClose} errMsg={errMsg} open={open} />);
    wrapper.find(Snackbar).simulate('close');
    expect(handleClose).toBeCalledTimes(1);
  });

  it('test open prop works', () => {
    const open = true; 
    const errMsg = "Test Message"; // mock message
    const wrapper = shallow(<GlobalError handleClose={noop} errMsg={errMsg} open={open} />);
    expect(wrapper.find(Snackbar).prop('open')).toEqual(true);
  });
});
