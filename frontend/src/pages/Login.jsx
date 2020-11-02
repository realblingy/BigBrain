import React from 'react';
import LoginForm from '../components/LoginForm';
import './Login.css';

function Login() {
  return (
    <div className="login">
      <div className="login-wrapper">
        <h1 className="welcome-message">Welcome to BigBrain. Please log in or register to make an account</h1>
        <LoginForm className="login-form" />
      </div>
    </div>
  );
}

export default Login;
