import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import { getQuizzes } from '../api';
import QuizButton from '../components/QuizButton';
import NewQuizButton from '../components/NewQuizButton';

const useStyles = makeStyles(() => ({
  quizGrid: {
    gridGap: '2rem',
    padding: '2rem',
  },
}));

function Dashboard(props) {
  const { token } = props;
  const [quizzes, setQuizzes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [newQuizName, setNewQuizName] = React.useState('');
  const classes = useStyles();
  const history = useHistory();

  React.useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const data = await getQuizzes(token);
        setQuizzes(JSON.stringify(data));
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.log(error);
      }
    }
    fetchData();
  }, [token]);

  const handleQuizBtnClick = (id) => {
    history.push(`/edit/${id}`);
  };

  return (
    <div className={classes.root}>
      {(loading) ? <CircularProgress color="primary" /> : (
        <Grid className={classes.quizGrid} container spacing={2}>
          {(quizzes.length > 0) && JSON.parse(quizzes)
            .map((q) => (
              <QuizButton
                key={q.name}
                name={q.name}
                numberOfQuestions={q.questions.length}
                id={q.id}
                redirect={() => handleQuizBtnClick(q.id)}
              />
            ))}
          <NewQuizButton
            key="New Quiz"
            name="Add Quiz"
            token={token}
            newQuizName={newQuizName}
            setNewQuizName={setNewQuizName}
            setQuizzes={setQuizzes}
            quizzes={quizzes}
          />
        </Grid>
      )}
    </div>
  );
}

Dashboard.propTypes = {
  token: PropTypes.string.isRequired,
};
export default Dashboard;
