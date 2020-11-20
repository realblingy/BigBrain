import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Button, Container } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { deleteQuiz, getQuizData, updateQuiz } from '../api';
import QuestionList from '../components/Edit/QuestionList';
import QuestionForm from '../components/Edit/QuestionForm';
import DeleteQuestionDialog from '../components/Edit/DeleteQuestionDialog';

const useStyles = makeStyles({
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
  },
  editBtn: {
    position: 'absolute',
    right: '5%',
  },
  questionBtn: {
    fontSize: '1.3em',
    fontWeight: 500,
  },
});

function EditGame(props) {
  const [questions, setQuestions] = React.useState([]);
  const [quizName, setQuizName] = React.useState('');
  const [editingQuestion, setEditingQuestion] = React.useState(null);
  const [action, setAction] = React.useState(null);
  const [showDialog, setShowDialog] = React.useState(false);
  const { id, token } = props;
  const classes = useStyles();
  const history = useHistory();

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
        console.log(error);
      }
    };
    fetchData();
  }, [id, token]);

  const handleDeleteClick = async (idx) => {
    const newQuestions = [...questions];
    newQuestions.splice(idx, 1);
    try {
      const result = await updateQuiz(token, quizName, newQuestions, id);
      if (result) {
        setQuestions(newQuestions);
        setAction('main');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleAddClick = () => {
    setAction('add');
  };

  const handleQuestionClick = (idx) => {
    setEditingQuestion(idx);
    setAction('edit');
  };

  const addNewQuestion = async (newQuestion) => {
    let newQuestions = [];
    if (action === 'add') {
      newQuestions = [...questions, newQuestion];
    } else if (action === 'edit') {
      newQuestions = [...questions];
      newQuestions[editingQuestion] = newQuestion;
    }

    try {
      const result = await updateQuiz(token, newQuestions, id);
      if (result) {
        setQuestions(newQuestions);
        setAction('main');
      }
    } catch (error) {
      console.log(error);
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
      console.log(error);
    }
  };

  const renderAction = () => {
    switch (action) {
      case 'add':
        return <QuestionForm submitForm={addNewQuestion} cancel={() => { setAction('main'); }} />;
      case 'edit':
        return (
          <QuestionForm
            questionObj={questions[editingQuestion]}
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

        <h1>{`Editing ${quizName}`}</h1>
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
