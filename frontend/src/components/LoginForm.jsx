import React from 'react';
import './LoginForm.css';
import { useHistory } from 'react-router-dom';
import port from '../api';

function LoginForm() {
  const history = useHistory();
  const [email, _setEmail] = React.useState('');
  const [password, _setPassword] = React.useState('');
  const [token, setToken] = React.useState('');

  const emailRef = React.useRef(email); // used within eventListener
  const passwordRef = React.useRef(password);

  const setEmail = (data) => {
    emailRef.current = data;
    _setEmail(data);
  };

  const setPassword = (data) => {
    passwordRef.current = data;
    _setPassword(data);
  };

  React.useEffect(() => {
    // save to local storage
  }, [token]);

  const submitLogin = async (inputEmail, inputPassword) => {
    const response = await fetch(`${port}/admin/auth/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: inputEmail,
        password: inputPassword,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const responseData = await response.json();
    if (response.status === 200) {
      setToken(responseData.token);
      history.push('/dashboard');
    } else {
      console.log(responseData.error);
    }
  };

  const EnterLogin = (event) => {
    if (event.key === 'Enter') {
      submitLogin(emailRef.current, passwordRef.current);
    }
  };

  React.useEffect(() => {
    document.addEventListener('keydown', EnterLogin);
    return () => {
      document.removeEventListener('keydown', EnterLogin);
    };
  }, []);

  return (
    <>
      <div className="login-form">
        <h1 className="login-title">LOGIN</h1>
        <label htmlFor="email">
          Email
          <input type="text" onChange={(event) => setEmail(event.target.value)} />
        </label>
        <label htmlFor="password">
          Password
          <input type="password" onChange={(event) => setPassword(event.target.value)} />
        </label>
        <button type="button" id="submit-login" onClick={() => { submitLogin(email, password); }}>Submit</button>
      </div>
    </>
  );
}

export default LoginForm;
