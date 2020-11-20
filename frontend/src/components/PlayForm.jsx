import React from 'react';
import Textfield from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { joinGame } from '../api';

const useStyles = makeStyles({
  title: {
    color: 'white',
    fontFamily: 'Montserrat',
    fontWeight: 'bold',
    fontSize: '3.5rem',
    marginBottom: '1.5rem',
  },
  input: {
    backgroundColor: 'white',
    borderRadius: '0.3rem',
    '&::placeholder': {
      fontSize: 20,
      fontWeight: 'bolder',
    },
    marginBottom: '0.5rem',
  },
  button: {
    width: 225,
    height: 40,
    backgroundColor: 'black',
    color: 'white',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginTop: '0.5rem',
    height: 24,
  },
});

function PlayForm(props) {
  const classes = useStyles();
  const { quizId, id } = props;
  const [sessionID, setSessionID] = React.useState(id === undefined ? '' : id);
  const [name, setName] = React.useState('');
  const [error, setError] = React.useState('');
  const history = useHistory();

  const joinGameHandler = async () => {
    try {
      const response = await joinGame(name, sessionID);
      history.push(`/game/${quizId}/${sessionID}/${response.playerId}`);
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <>
      <Typography className={classes.title} variant="h1">Play Game</Typography>
      <Textfield
        variant="outlined"
        InputProps={{
          classes: {
            input: classes.input,
          },
        }}
        className={classes.input}
        placeholder="enter a name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
      />
      <Textfield
        variant="outlined"
        InputProps={{
          classes: {
            input: classes.input,
          },
        }}
        className={classes.input}
        placeholder="enter a session ID"
        value={sessionID}
        onChange={(e) => {
          setSessionID(e.target.value);
          setError('');
        }}
      />
      <Button onClick={joinGameHandler} className={classes.button} variant="contained">Enter</Button>
      <Typography className={classes.error}>{error}</Typography>
    </>
  );
}

PlayForm.propTypes = {
  id: PropTypes.string,
  quizId: PropTypes.string,
};

PlayForm.defaultProps = {
  id: undefined,
  quizId: undefined,
};

export default PlayForm;
