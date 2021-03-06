import { ButtonBase, makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';
import PauseIcon from '@material-ui/icons/Pause';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TokenContext from '../TokenContext';
import {
  endGamePost, startGamePost, getQuizData, getSessionStatus, advanceQuizPost,
} from '../api';

const useStyles = makeStyles(() => ({
  root: {
    height: 200,
    width: 300,
    borderRadius: '3%',
    border: 'solid black 1px',
  },
  name: {
    color: 'white',
  },
  subHeadings: {
    color: 'white',
    position: 'absolute',
    bottom: '5%',
  },
  image: {
    postion: 'relative',
  },
  icon: {
    fontSize: 50,
    display: 'block',
    color: 'white',
    backgroundColor: '#93073e',
    position: 'absolute',
    top: '10%',
    borderRadius: '0.3rem',
  },
  pause: {
    fontSize: 50,
    display: 'block',
    color: 'white',
    backgroundColor: '#93073e',
    position: 'absolute',
    top: '10%',
    left: '30%',
    borderRadius: '0.3rem',
  },
  next: {
    fontSize: 50,
    display: 'block',
    color: 'white',
    backgroundColor: '#93073e',
    position: 'absolute',
    top: '10%',
    right: '30%',
    borderRadius: '0.3rem',
  },
}));

function QuizButton(props) {
  const { token } = useContext(TokenContext);
  const classes = useStyles();
  const {
    color, name, numberOfQuestions, redirect, id, active, handleStart, handleStop,
    setSessionID, setQuizId, time,
  } = props;
  const [started, setStarted] = React.useState(false);

  React.useEffect(() => {
    if (active !== null) {
      getSessionStatus(token, active).then((r) => {
        if (r.results.position !== -1) {
          setStarted(true);
        }
      });
    }
  });

  // check if game has ended
  React.useEffect(() => {
    let prev = null;
    const fetchQuizStatus = setInterval(async () => {
      const response = await getQuizData(id, token);
      if (prev !== null && response.active === null) {
        // need to reload all quiz data to get new active == null value
        setSessionID(prev);
        handleStop();
        setStarted(false);
      }
      prev = response.active;
    }, 1000);
    return () => {
      clearInterval(fetchQuizStatus);
    };
  });

  const startGame = async (e) => {
    e.stopPropagation();
    await startGamePost(token, id);
    const quizData = await getQuizData(id, token);
    setSessionID(quizData.active);
    setQuizId(id);
    handleStart();
  };

  const endGame = async (e) => {
    e.stopPropagation();
    const quizData = await getQuizData(id, token);
    setSessionID(quizData.active);
    await endGamePost(token, id);
    handleStop();
    setStarted(false);
  };

  const advanceQuestion = async (e) => {
    e.stopPropagation();
    await advanceQuizPost(token, id);
  };

  const timeFormat = (timeTaken) => {
    const hours = Math.floor(timeTaken / 3000);
    const minutes = Math.floor(timeTaken / 60);
    const seconds = timeTaken - minutes * 60;
    let timeString = '';
    if (hours > 0) timeString += `${hours}h `;
    if (minutes > 0) timeString += `${minutes}m `;
    if (seconds > 0) timeString += `${seconds}s`;
    if (timeString === '') {
      return '0s';
    }

    return timeString;
  };

  return (
    <ButtonBase
      focusRipple
      className={classes.root}
      variant="contained"
      style={{ backgroundColor: color }}
      id={id}
      onClick={redirect}
      aria-label={`${name} Quiz Button`}
    >
      <h1 className={classes.name}>
        { name }
      </h1>
      {started && (
        <div>
          <PauseIcon
            inputProps={{ 'aria-label': 'Pause Button' }}
            onClick={(e) => endGame(e)}
            className={classes.pause}
            name="pauseIcon"
          />
          <NavigateNextIcon
            inputProps={{ 'aria-label': 'Next Button' }}
            onClick={(e) => advanceQuestion(e)}
            className={classes.next}
            name="navigateIcon"
          />
        </div>
      )}
      {!started && <PlayArrowIcon onClick={(e) => startGame(e)} className={classes.icon} />}
      <h4
        className={classes.subHeadings}
        style={{ right: '5%' }}
      >
        Questions:
        {numberOfQuestions}
      </h4>
      <h4
        className={classes.subHeadings}
        style={{ left: '5%' }}
      >
        Total Time:
        {timeFormat(time)}
      </h4>
    </ButtonBase>
  );
}

QuizButton.propTypes = {
  color: PropTypes.string,
  name: PropTypes.string.isRequired,
  numberOfQuestions: PropTypes.number.isRequired,
  redirect: PropTypes.func.isRequired,
  id: PropTypes.number.isRequired,
  handleStart: PropTypes.func.isRequired,
  handleStop: PropTypes.func.isRequired,
  setSessionID: PropTypes.func,
  setQuizId: PropTypes.func.isRequired,
  active: PropTypes.number,
  time: PropTypes.string.isRequired,
  quizEnded: PropTypes.shape({
    quizID: PropTypes.number,
    sessionID: PropTypes.number,
  }),
};

QuizButton.defaultProps = {
  color: '#E53026',
  setSessionID: null,
  active: null,
  quizEnded: null,
};

export default QuizButton;
