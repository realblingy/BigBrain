import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import Logout from '../components/LogoutButton';

function Dashboard(props) {
  const { setToken, token } = props;
  if (token === '') {
    return <Redirect to="/" />;
  }

  return (
    <div>
      DashBoard
      <Logout setToken={setToken} token={token} />
    </div>
  );
}

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};
export default Dashboard;
