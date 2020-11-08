import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import port from '../api';

function LogoutButton(props) {
  const { setToken, token } = props;
  const history = useHistory();
  const logOut = async () => {
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
      history.push('/');
    } else {
      console.log(responseData.error);
    }
  };

  return (
    <button type="button" onClick={logOut}>
      Logout
    </button>
  );
}

LogoutButton.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default LogoutButton;
