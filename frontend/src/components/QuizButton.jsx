import { ButtonBase, makeStyles } from '@material-ui/core';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import PauseIcon from '@material-ui/icons/Pause';
import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import TokenContext from '../TokenContext';
import { endGamePost, startGamePost } from '../api';

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
}));

function QuizButton(props) {
  const { token } = useContext(TokenContext);
  const classes = useStyles();
  const {
    color, name, numberOfQuestions, redirect, id, active, handleOpen, setSessionID,
  } = props;
  const [gameState, setGameState] = React.useState(!(active === null));

  const startGame = (e) => {
    e.stopPropagation();
    startGamePost(token, id);
    setGameState(true);
    setSessionID(id);
    handleOpen();
  };
  const endGame = (e) => {
    e.stopPropagation();
    endGamePost(token, id);
    setGameState(false);
  };
  return (
    <ButtonBase
      focusRipple
      className={classes.root}
      variant="contained"
      style={{ backgroundColor: color }}
      id={id}
      onClick={redirect}
    >
      <h1 className={classes.name}>
        { name }
      </h1>
      {gameState && <PauseIcon onClick={(e) => endGame(e)} className={classes.icon} />}
      {!gameState && <PlayArrowIcon onClick={(e) => startGame(e)} className={classes.icon} />}
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
  active: PropTypes.number,
  handleOpen: PropTypes.func.isRequired,
  setSessionID: PropTypes.func,
};

QuizButton.defaultProps = {
  color: '#E53026',
  active: null,
  setSessionID: null,
};

export default QuizButton;
