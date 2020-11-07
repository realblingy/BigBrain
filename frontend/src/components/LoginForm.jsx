import React from 'react';
import './LoginForm.css';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import port from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '15px 0px',
  },
  button: {
    margin: '20px 0px',
    background: 'transparent',
    '&:hover': {
      backgroundColor: theme.palette.primary.main,
    },
  },
  icon: {
    fontSize: '3rem',
  },
  loginTitle: {
    display: 'flex',
    alignItems: 'center',
  },
  error: {
    minHeight: '24px',
    color: theme.palette.error.main,
  },
}));

function LoginForm(props) {
  const { setToken } = props;
  const classes = useStyles();
  const history = useHistory();
  const [email, _setEmail] = React.useState('');
  const [password, _setPassword] = React.useState('');
  // const [token, setToken] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');

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
      console.log(responseData);
      setErrorMsg(responseData.error);
    }
  };

  const EnterLogin = (event) => {
    if (event.key === 'Enter') {
      submitLogin(emailRef.current, passwordRef.current);
    }
  };

  const goToRegister = () => {
    history.push('/register');
  };

  React.useEffect(() => {
    document.addEventListener('keydown', EnterLogin);
    return () => {
      document.removeEventListener('keydown', EnterLogin);
    };
  });

  return (
    <>
      <div className="login-form">
        <Typography variant="h2" className={classes.loginTitle}>
          <PersonIcon className={classes.icon} />
          LOGIN
        </Typography>
        <TextField
          className={classes.root}
          placeholder="Email"
          inputProps={{
            'aria-label': 'email input',
          }}
          variant="outlined"
          onChange={(event) => setEmail(event.target.value)}
          onClick={() => setErrorMsg('')}
        />
        <TextField
          placeholder="Password"
          inputProps={{
            'aria-label': 'password input',
          }}
          variant="outlined"
          type="password"
          onChange={(event) => setPassword(event.target.value)}
          onClick={() => setErrorMsg('')}
        />
        <ButtonGroup aria-label="contained button group">
          <Button className={classes.button} variant="contained" type="button" id="submit-login" onClick={() => { submitLogin(email, password); }}>Log On</Button>
          <Button className={classes.button} variant="contained" type="button" onClick={goToRegister}>Register</Button>
        </ButtonGroup>
        <Typography className={classes.error}>{errorMsg}</Typography>
      </div>
    </>
  );
}

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default LoginForm;
