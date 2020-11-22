import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import TokenContext from '../TokenContext';
import './Login.css';

function Login() {
  const { token, setToken } = useContext(TokenContext);
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

export default Login;
