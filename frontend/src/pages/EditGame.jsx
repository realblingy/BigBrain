import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import { getQuizData, updateQuiz } from '../api';
import QuestionList from '../components/Edit/QuestionList';
import QuestionForm from '../components/Edit/QuestionForm';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  questionContainer: {
    border: 'solid black 1px',
  },
  deleteBtn: {
    position: 'absolute',
    right: '9%',
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
  const { id, token } = props;
  const classes = useStyles();

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
      const result = await updateQuiz(token, quizName, newQuestions, id);
      if (result) {
        setQuestions(newQuestions);
        setAction('main');
      }
    } catch (error) {
      console.log(error);
    }
  };

  // const updateQuestion = async () => {
  //   const newQuestions = [...questions]
  // }

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
    <Container className={classes.root}>
      <h1>{`Editing ${quizName}`}</h1>
      {renderAction()}
    </Container>
  );
}

EditGame.propTypes = {
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default EditGame;
