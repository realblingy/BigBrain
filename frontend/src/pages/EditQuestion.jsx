import React from 'react';
import { useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';
import { Container } from '@material-ui/core';
import QuestionForm from '../components/Edit/QuestionForm';
import { getQuizData, updateQuiz } from '../api';
import GlobalError from '../components/GlobalError';

/**
 * Page where users can edit their question for a quiz
 * @param {*} props
 */
function EditQuestion(props) {
  const { id, questionid, token } = props;
  const [questions, setQuestions] = React.useState([]);
  const history = useHistory();
  const [errorMsg, setErrorMsg] = React.useState('');
  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMsg('');
  };
  // Fetches the data quiz questions
  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const quizData = await getQuizData(id, token);
        setQuestions(quizData.questions);
      } catch (error) {
        setErrorMsg('Could not load question at this time. Please try again.');
      }
    };
    fetchData();
  }, [id, token]);
  // Goes back to the edit page for quiz
  const returnToQuizPage = async () => {
    history.push(`/edit/${id}`);
  };
  // Uses previous questions to update the new question
  const updateQuestion = (question) => {
    const newQuestions = [...questions];
    newQuestions[questionid] = question;

    updateQuiz(token, newQuestions, id)
      .then(() => {
        returnToQuizPage();
      })
      .catch(() => {
        setErrorMsg('Could not update question at this time. Please try again.');
      });
  };

  return (
    <Container>
      <GlobalError errMsg={errorMsg} open={errorMsg !== ''} handleClose={handleErrorClose} />
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
