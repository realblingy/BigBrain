import React from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { makeStyles } from '@material-ui/core';
import Button from '@material-ui/core/Button';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import PropTypes from 'prop-types';
import port from '../api';

const useStyles = makeStyles((theme) => ({
  input: {
    width: 400,
    marginTop: 10,
    marginBottom: 10,
  },
  register: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fefb92',
    height: '100vh',
  },
  button: {
    margin: '20px 0px',
    background: 'transparent',
    '&:hover': {
      backgroundColor: '#fefb92',
    },
  },
  error: {
    minHeight: '24px',
    color: theme.palette.error.main,
  },
}));

function Register(props) {
  const classes = useStyles();
  const history = useHistory();
  const { setToken, token } = props;
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [name, setName] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

  const submitRegister = React.useCallback(
    async (inputEmail, inputPassword, inputName) => {
      if (inputEmail === '') {
        setErrorMsg('Email cannot be empty');
        return;
      }
      console.log(inputEmail, inputPassword, inputName);
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
        setErrorMsg(responseData.error);
      }
    },
    [history, setToken],
  );

  if (token !== '') {
    return <Redirect to="/dashboard" />;
  }

  const goToLogin = () => {
    history.push('/');
  };

  return (
    <div className={classes.register}>
      <h1>Please register your details</h1>
      <TextField
        placeholder="Email"
        inputProps={{
          'aria-label': 'email input',
        }}
        variant="outlined"
        className={classes.input}
        type="text"
        onChange={(e) => setEmail(e.target.value)}
        onClick={() => setErrorMsg('')}
      />
      <TextField
        placeholder="Password"
        inputProps={{
          'aria-label': 'password input',
        }}
        variant="outlined"
        className={classes.input}
        type="password"
        onChange={(e) => setPassword(e.target.value)}
        onClick={() => setErrorMsg('')}
      />
      <TextField
        placeholder="Name"
        inputProps={{
          'aria-label': 'name input',
        }}
        variant="outlined"
        className={classes.input}
        type="text"
        onClick={() => setErrorMsg('')}
        onChange={(e) => setName(e.target.value)}
      />
      <ButtonGroup>
        <Button variant="contained" className={classes.button} type="button" onClick={goToLogin}>Back</Button>
        <Button variant="contained" className={classes.button} type="button" onClick={() => { submitRegister(email, password, name); }}>Submit</Button>
      </ButtonGroup>
      <Typography className={classes.error}>{errorMsg}</Typography>
    </div>
  );
}

Register.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default Register;
