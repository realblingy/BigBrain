import React from 'react';
import { useHistory } from 'react-router-dom';

function LogoutButton() {
  const history = useHistory();
  const logOut = () => {
    localStorage.removeItem('token');
    history.push('/');
  };

  return (
    <button type="button" onClick={logOut}>
      Logout
    </button>
  );
}

export default LogoutButton;
