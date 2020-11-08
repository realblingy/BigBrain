import React from 'react';
import PropTypes from 'prop-types';
// import { Redirect } from 'react-router-dom';
import { CircularProgress, Grid } from '@material-ui/core';
import Logout from '../components/LogoutButton';
import Navbar from '../components/Navbar';
import port from '../api';
import QuizButton from '../components/QuizButton';

function Dashboard(props) {
  const { setToken, token } = props;
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  React.useEffect(() => {
    const getQuizData = async (quizid) => {
      const response = await fetch(`${port}/admin/quiz/${quizid}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const responseData = await response.json();
        return responseData;
      }
      throw new Error(`Could not load quiz: ${quizid}`);
    };

    const getQuizzes = async () => {
      const response = await fetch(`${port}/admin/quiz`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const responseData = await response.json();
        const responseQuizzes = await responseData.quizzes.map(async (quiz) => {
          const { id } = quiz;
          const newQuiz = await getQuizData(id);
          return newQuiz;
        });
        return Promise.all(responseQuizzes);
      }
      throw new Error('Could not load quizzes.');
    };

    async function fetchData() {
      try {
        setLoading(true);
        const data = await getQuizzes();
        setQuizzes(JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    fetchData();
  }, [token]);

  return (
    <div>
      <Navbar />
      {(loading) ? <CircularProgress color="primary" /> : (
        <Grid>
          {(quizzes.length > 0) && JSON.parse(quizzes)
            .map((q) => (
              <QuizButton
                key={q.name}
                name={q.name}
                numberOfQuestions={q.questions.length}
              />
            ))}
        </Grid>
      )}
      <Logout setToken={setToken} token={token} />
    </div>
  );
}

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};
export default Dashboard;
