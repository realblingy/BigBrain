import React from 'react';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import PersonIcon from '@material-ui/icons/Person';
import ButtonGroup from '@material-ui/core/ButtonGroup';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import GlobalError from './GlobalError';
import port from '../api';

const useStyles = makeStyles((theme) => ({
  root: {
    margin: '15px 0px',
  },
  button: {
    margin: '20px 0px',
    background: 'transparent',
    '&:hover': {
      backgroundColor: '#fefb92',
    },
  },
  icon: {
    fontSize: '3rem',
    '@media (max-width: 550px)': {
      fontSize: '1rem',
    },
  },
  loginTitle: {
    display: 'flex',
    alignItems: 'center',
    '@media (max-width: 550px)': {
      fontSize: '1rem',
    },
  },
  error: {
    minHeight: '24px',
    color: theme.palette.error.main,
  },
  loginForm: {
    display: 'flex',
    flexDirection: 'column',
    width: 400,
    height: 400,
    border: '1px solid black',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: '0.5rem',
    '@media (max-width: 550px)': {
      width: 250,
      height: 250,
    },
  },
}));

function LoginForm(props) {
  const { setToken } = props;
  const classes = useStyles();
  const history = useHistory();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [errorMsg, setErrorMsg] = React.useState('');
  const [errorState, setErrorState] = React.useState(false);

  const submitLogin = React.useCallback(
    async (inputEmail, inputPassword) => {
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
        setErrorMsg(responseData.error);
        setErrorState(true);
      }
    },
    [history, setToken],
  );

  const goToRegister = () => {
    history.push('/register');
  };

  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorState(false);
  };

  return (
    <>
      <div className={classes.loginForm}>
        <Typography variant="h2" className={classes.loginTitle}>
          <PersonIcon className={classes.icon} />
          LOGIN
        </Typography>
        <TextField
          placeholder="Email"
          inputProps={{
            'aria-label': 'email input',
          }}
          variant="outlined"
          name="email"
          onChange={(event) => setEmail(event.target.value)}
          onClick={() => handleErrorClose()}
        />
        <TextField
          placeholder="Password"
          inputProps={{
            'aria-label': 'password input',
          }}
          variant="outlined"
          type="password"
          name="passwordField"
          onChange={(event) => setPassword(event.target.value)}
          onClick={() => handleErrorClose()}
        />
        <ButtonGroup aria-label="contained button group">
          <Button className={classes.button} variant="contained" type="button" id="submit-login" onClick={() => { submitLogin(email, password); }}>Log In</Button>
          <Button name="register" className={classes.button} variant="contained" type="button" onClick={goToRegister}>Register</Button>
        </ButtonGroup>
        <GlobalError errMsg={errorMsg} open={errorState} handleClose={handleErrorClose} />
      </div>
    </>
  );
}

LoginForm.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default LoginForm;
