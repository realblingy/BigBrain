import { ButtonBase, makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React from 'react';
import { postNewQuiz, getQuizData } from '../api';

const useStyles = makeStyles(() => ({
  root: {
    height: 200,
    width: 300,
    borderRadius: '3%',
    border: 'dotted black 2px',
    backgroundColor: 'whitesmoke',
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    color: 'black',
  },
  subHeadings: {
    color: 'white',
    position: 'absolute',
    bottom: '5%',
  },
  image: {
    postion: 'relative',
  },
}));

function NewQuizButton(props) {
  const {
    token, newQuizName, setNewQuizName, setQuizzes, quizzes,
  } = props;
  const classes = useStyles();

  const renderNewQuiz = async () => {
    const newQuizId = await postNewQuiz(token, newQuizName);
    let newQuiz = await getQuizData(newQuizId.quizId, token);
    newQuiz = { ...newQuiz, id: parseInt(newQuizId.quizId, 10) };
    let newQuizzes = JSON.parse(quizzes);
    newQuizzes = [...newQuizzes, newQuiz];
    setQuizzes(JSON.stringify(newQuizzes));
  };

  const onClick = () => {
    renderNewQuiz();
    setNewQuizName('');
  };

  return (
    <ButtonBase
      focusRipple
      className={classes.root}
      variant="contained"
    >
      <h1 className={classes.name}>
        New Quiz
      </h1>
      <TextField onChange={(e) => setNewQuizName(e.target.value)} value={newQuizName} />
      <AddCircleOutlineIcon
        onClick={onClick}
      />
    </ButtonBase>
  );
}

NewQuizButton.propTypes = {
  token: PropTypes.string.isRequired,
  newQuizName: PropTypes.string.isRequired,
  setNewQuizName: PropTypes.func.isRequired,
  setQuizzes: PropTypes.func.isRequired,
  quizzes: PropTypes.string.isRequired,
};

export default NewQuizButton;
