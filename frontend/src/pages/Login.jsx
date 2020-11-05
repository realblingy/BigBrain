import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import LoginForm from '../components/LoginForm';
import './Login.css';

function Login(props) {
  const { setToken, token } = props;
  if (token !== '') {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="login">
      <h1 className="welcome-message">Welcome to BigBrain. Please log in or register to make an account</h1>
      <LoginForm setToken={setToken} className="login-form" />
    </div>
  );
}

Login.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default Login;
