import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import QuestionForm from '../components/Edit/QuestionForm';
import { getQuizData, updateQuiz } from '../api';

function EditQuestion(props) {
  const { id, questionid, token } = props;
  const [questions, setQuestions] = React.useState([]);
  const history = useHistory();

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const quizData = await getQuizData(id, token);
        setQuestions(quizData.questions);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id, token]);

  const returnToQuizPage = async () => {
    history.push(`/edit/${id}`);
  };

  const updateQuestion = (question) => {
    const newQuestions = [...questions];
    newQuestions[questionid] = question;

    updateQuiz(token, newQuestions, id)
      .then(() => {
        returnToQuizPage();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <Container>
      <h1>{`Editing Question ${questionid}`}</h1>
      <QuestionForm
        questionObj={questions[questionid]}
        cancel={returnToQuizPage}
        action="edit"
        submitForm={updateQuestion}
      />
    </Container>
  );
}

EditQuestion.propTypes = {
  id: PropTypes.number.isRequired,
  questionid: PropTypes.number.isRequired,
  token: PropTypes.string.isRequired,
};

export default EditQuestion;
