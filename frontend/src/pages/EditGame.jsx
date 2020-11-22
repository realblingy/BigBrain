import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { deleteQuiz, getQuizData, updateQuiz } from '../api';
import QuestionList from '../components/Edit/QuestionList';
import QuestionForm from '../components/Edit/QuestionForm';
import DeleteQuestionDialog from '../components/Edit/DeleteQuestionDialog';
import GlobalError from '../components/GlobalError';

/* eslint-disable no-param-reassign */

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  questionContainer: {
    border: 'solid black 1px',
  },
  deleteBtn: {
    width: '150px',
    '&:hover': {
      backgroundColor: 'red',
      color: 'white',
    },
    marginTop: '1rem',
    position: 'absolute',
    right: '5%',
    [theme.breakpoints.down(600)]: {
      width: '60px',
      fontSize: '0.7em',
    },
  },
  editBtn: {
    position: 'absolute',
    right: '5%',
  },
  questionBtn: {
    fontSize: '1.3em',
    fontWeight: 500,
  },
  editing: {
    [theme.breakpoints.down(600)]: {
      maxWidth: 250,
    },
  },
}));
/**
 * Page where users can edit the questions of a game
 * @param {*} props
 */
function EditGame(props) {
  const [questions, setQuestions] = React.useState([]);
  const [quizName, setQuizName] = React.useState('');
  const [editingQuestion, setEditingQuestion] = React.useState(null);
  const [action, setAction] = React.useState(null);
  const [showDialog, setShowDialog] = React.useState(false);
  const [errorMsg, setErrorMsg] = React.useState('');
  const { id, token } = props;
  const classes = useStyles();
  const history = useHistory();
  // On load, main is set as the action which shows all the questions of a quiz
  React.useEffect(() => {
    setAction('main');
  }, []);
  React.useEffect(() => {
    setQuestions([]);
    const fetchData = async () => {
      try {
        const quizData = await getQuizData(id, token);
        setQuizName(quizData.name);
        setQuestions(quizData.questions);
      } catch (error) {
        setErrorMsg('Could not load quiz data at this time. Try again');
      }
    };
    fetchData();
  }, [id, token]);
  // Deletes a question of a quiz
  const handleDeleteClick = async (idx) => {
    const newQuestions = [...questions];
    newQuestions.splice(idx, 1);
    try {
      const result = await updateQuiz(token, newQuestions, id);
      if (result) {
        setQuestions(newQuestions);
        setAction('main');
      }
    } catch (error) {
      setErrorMsg('Could not delete question at this time. Try agian.');
    }
  };
  const handleAddClick = () => {
    setAction('add');
  };
  // Redirects to the editing page for a question
  const handleQuestionClick = (idx) => {
    setEditingQuestion(idx);
    setAction('edit');
    history.push(`/edit/${id}/${idx}`);
  };
  // Adds a new question and sends a request to the backend
  const addNewQuestion = async (newQuestion) => {
    let newQuestions = [];
    if (action === 'add') {
      newQuestions = [...questions, newQuestion];
    } else if (action === 'edit') {
      newQuestions = [...questions];
      newQuestions[editingQuestion] = newQuestion;
    }
    newQuestions = newQuestions.map((q, idx) => {
      q.id = idx;
      return q;
    });
    try {
      const result = await updateQuiz(token, newQuestions, id);
      if (result) {
        setQuestions(newQuestions);
        setAction('main');
      }
    } catch (error) {
      setErrorMsg('Could update quiz at this moment. Try again.');
    }
  };
  const handleDeleteBtnClick = () => {
    setShowDialog(true);
  };
  const deleteGame = async () => {
    try {
      const result = await deleteQuiz(token, id);
      if (result) {
        setShowDialog(false);
        history.push('/dashboard');
      }
    } catch (error) {
      setErrorMsg('Could not delete the game at this moment. Try again.');
    }
  };
  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMsg('');
  };
  // Based on the action state, renders either a question form or question list of quiz
  const renderAction = () => {
    switch (action) {
      case 'add':
        return (
          <QuestionForm
            action={action}
            submitForm={addNewQuestion}
            cancel={() => { setAction('main'); }}
          />
        );
      default:
        return (
          <>
            <p>{questions.length > 0 ? 'Select a question to edit' : 'Make a question!' }</p>
            <QuestionList
              questions={questions}
              handleDeleteClick={handleDeleteClick}
              handleAddClick={handleAddClick}
              handleQuestionClick={handleQuestionClick}
            />
          </>
        );
    }
  };
  return (
    <>
      <GlobalError errMsg={errorMsg} open={errorMsg !== ''} handleClose={handleErrorClose} />
      <DeleteQuestionDialog
        open={showDialog}
        close={() => setShowDialog(false)}
        deleteGame={deleteGame}
      />
      <Container className={classes.root}>
        {action === 'main' && (
          <Button
            variant="outlined"
            color="secondary"
            className={classes.deleteBtn}
            onClick={handleDeleteBtnClick}
          >
            Delete Game
          </Button>
        )}

        <h1 className={classes.editing}>{`Editing ${quizName}`}</h1>
        {renderAction()}
      </Container>
    </>
  );
}

EditGame.propTypes = {
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default EditGame;
