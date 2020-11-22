import {
  ButtonBase, IconButton, makeStyles, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
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
  input: {
    marginBottom: 15,
  },
  uploadIcon: {
    position: 'absolute',
    right: '0%',
    bottom: '0%',
  },
}));

function NewQuizButton(props) {
  const {
    token, newQuizName, setNewQuizName, setQuizzes, quizzes,
    openQuestionDialog,
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
      className={classes.root}
      variant="contained"
      disableRipple
      aria-label="New Quiz"
    >
      <h1 className={classes.name}>
        New Quiz
      </h1>
      <TextField
        placeholder="Enter Quiz Name"
        className={classes.input}
        onChange={(e) => setNewQuizName(e.target.value)}
        value={newQuizName}
        inputProps={{ 'aria-label': 'New Quiz Name FIeld' }}
      />
      <AddCircleOutlineIcon
        onClick={onClick}
        aria-label="Add Quiz"
      />
      <IconButton
        onClick={openQuestionDialog}
        className={classes.uploadIcon}
        aria-label="Upload Quiz"
      >
        <CloudUploadIcon />
      </IconButton>
    </ButtonBase>
  );
}

NewQuizButton.propTypes = {
  token: PropTypes.string.isRequired,
  newQuizName: PropTypes.string.isRequired,
  setNewQuizName: PropTypes.func.isRequired,
  setQuizzes: PropTypes.func.isRequired,
  quizzes: PropTypes.string.isRequired,
  openQuestionDialog: PropTypes.func.isRequired,
};

export default NewQuizButton;
