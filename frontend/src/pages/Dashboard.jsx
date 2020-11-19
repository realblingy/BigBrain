import React from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { CircularProgress, Grid } from '@material-ui/core';
import { getQuizzes } from '../api';
import QuizButton from '../components/QuizButton';
import NewQuizButton from '../components/NewQuizButton';
import SessionDialog from '../components/SessionDialog';
import ResultDialog from '../components/ResultDialog';

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
  const [start, setStart] = React.useState(false);
  const [stop, setStop] = React.useState(false);
  const [sessionID, setSessionID] = React.useState(null);
  const [quizID, setQuizId] = React.useState(null);
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
  }, [token, start]);

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
                active={q.active}
                redirect={() => handleQuizBtnClick(q.id)}
                handleStart={() => setStart(true)}
                handleStop={() => setStop(true)}
                setSessionID={setSessionID}
                setQuizId={setQuizId}
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
      <SessionDialog
        quizID={quizID}
        sessionID={sessionID}
        open={start}
        setStart={setStart}
        handleClose={() => setStart(false)}
      />
      <ResultDialog sessionID={sessionID} open={stop} handleClose={() => setStop(false)} />
    </div>
  );
}

Dashboard.propTypes = {
  token: PropTypes.string.isRequired,
};
export default Dashboard;
