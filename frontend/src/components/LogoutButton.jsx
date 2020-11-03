import React from 'react';
import { useHistory } from 'react-router-dom';
import port from '../api';

function LogoutButton() {
  const history = useHistory();
  const logOut = async () => {
    const response = await fetch(`${port}/admin/auth/logout`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });

    const responseData = await response.json();
    if (response.status === 200) {
      localStorage.removeItem('token');
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

export default LogoutButton;
