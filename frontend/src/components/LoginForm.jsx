import React from 'react';
import './LoginForm.css';
import port from '../api';

function LoginForm() {
  const submitLogin = async () => {
    const response = await fetch(`${port}/admin/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: 'hayden@unsw.edu.au',
        password: 'adummypassword',
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    console.log(responseData);
    console.log(port);
  };

  return (
    <>
      <form className="login-form">
        <h1 className="login-title">LOGIN</h1>
        <label htmlFor="email">
          Email
          <input type="text" id="email" />
        </label>
        <label htmlFor="password">
          Password
          <input type="text" id="password" />
        </label>
        <button type="button" id="submit-login" onClick={submitLogin}>Submit</button>
      </form>
    </>
  );
}

export default LoginForm;
