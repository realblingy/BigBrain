import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import { Container } from '@material-ui/core';
import { getQuizData } from '../api';
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
  const [action, setAction] = React.useState(null);
  const { id, token } = props;
  const classes = useStyles();

  React.useEffect(() => {
    setQuestions([]);
    const fetchData = async () => {
      try {
        const data = await getQuizData(id, token);
        setQuestions(data.questions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, token]);

  React.useEffect(() => {
    console.log('action');
  }, [action]);

  const handleDeleteClick = () => {
    setAction('delete');
  };

  const handleAddClick = () => {
    setAction('add');
  };

  const renderAction = () => {
    switch (action) {
      case 'add':
        return <QuestionForm />;
      default:
        return (
          <QuestionList
            questions={questions}
            handleDeleteClick={handleDeleteClick}
            handleAddClick={handleAddClick}
          />
        );
    }
  };

  return (
    <Container className={classes.root}>
      <h1>Edit Game</h1>
      {renderAction()}
    </Container>
  );
}

EditGame.propTypes = {
  id: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default EditGame;
