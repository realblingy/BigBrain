import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@material-ui/core';
import PropTypes from 'prop-types';
import port from '../api';

function LogoutButton(props) {
  const { setToken, token } = props;
  console.log(useHistory());
  const history = useHistory();
  const logOut = async () => {
    console.log(token);
    const response = await fetch(`${port}/admin/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.json();
    if (response.status === 200) {
      setToken('');
      console.log(history);
      history.push('/');
    } else {
      console.log(responseData.error);
    }
  };

  return (
    <Button color="inherit" type="button" onClick={logOut}>
      Logout
    </Button>
  );
}

LogoutButton.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default LogoutButton;
