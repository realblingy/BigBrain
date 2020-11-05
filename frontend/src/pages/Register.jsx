import React from 'react';
import './Register.css';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import port from '../api';

function Register(props) {
  const { setToken } = props;
  const history = useHistory();
  const [email, _setEmail] = React.useState('');
  const [password, _setPassword] = React.useState('');
  const [name, _setName] = React.useState('');

  const emailRef = React.useRef(email);
  const passwordRef = React.useRef(password);
  const nameRef = React.useRef(name);

  const setEmail = (data) => {
    emailRef.current = data;
    _setEmail(data);
  };

  const setPassword = (data) => {
    passwordRef.current = data;
    _setPassword(data);
  };

  const setName = (data) => {
    nameRef.current = data;
    _setName(data);
  };

  const submitRegister = async (inputEmail, inputPassword, inputName) => {
    const response = await fetch(`${port}/admin/auth/register`, {
      method: 'POST',
      body: JSON.stringify({
        email: inputEmail,
        password: inputPassword,
        name: inputName,
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

  const EnterRegister = (e) => {
    if (e.key === 'Enter') {
      submitRegister(emailRef, passwordRef, nameRef);
    }
  };

  // Handle keydown enter to submit register
  React.useEffect(() => {
    document.addEventListener('keydown', EnterRegister);
    return () => {
      document.removeEventListener('keydown', EnterRegister);
    };
  }, []);

  return (
    <div className="register">
      <h1>Please register your details</h1>
      <label htmlFor="email">
        Email
        <input type="text" onChange={(e) => setEmail(e.target.value)} />
      </label>
      <label htmlFor="password">
        Password
        <input type="password" onChange={(e) => setPassword(e.target.value)} />
      </label>
      <label htmlFor="name">
        Name
        <input type="text" onChange={(e) => setName(e.target.value)} />
      </label>
      <button type="button" onClick={() => { submitRegister(email, password, name); }}>Submit</button>
    </div>
  );
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default Register;
