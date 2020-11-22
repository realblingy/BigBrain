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
import UploadQuestionDialog from '../components/UploadQuestionDialog';

const useStyles = makeStyles((theme) => ({
  quizGrid: {
    gridGap: '2rem',
    padding: '2rem',
    [theme.breakpoints.down(680)]: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    },
  },
}));

/**
 * Main Dashboard where users can add, delete and update questions of a quiz
 * @param {*} props
 */
function Dashboard(props) {
  const { token } = props;
  const [quizzes, setQuizzes] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [newQuizName, setNewQuizName] = React.useState('');
  const [start, setStart] = React.useState(false);
  const [stop, setStop] = React.useState(false);
  const [sessionID, setSessionID] = React.useState(null);
  const [quizID, setQuizId] = React.useState(null);
  const [showUploadDialog, setShowUploadDialog] = React.useState(false);
  const classes = useStyles();
  const history = useHistory();
  // Fetches all quizzes made by a user given a token
  const fetchQuizzes = async (tokenID) => {
    try {
      setLoading(true);
      const data = await getQuizzes(tokenID);
      setQuizzes(JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  React.useEffect(() => {
    fetchQuizzes(token);
  }, [token]);
  // Redirects to the edit question page
  const handleQuizBtnClick = (id) => {
    history.push(`/edit/${id}`);
  };
  // Calculates a quiz's time by iterating over each question and summing their times
  const getQuizTotalTime = (quiz) => {
    let totalTime = 0;
    quiz.questions.forEach((question) => {
      totalTime += question.timer;
    });
    return totalTime;
  };

  return (
    <div className={classes.root}>
      {(loading) ? <CircularProgress color="primary" /> : (
        <Grid className={classes.quizGrid} container spacing={2}>
          {(quizzes.length > 0) && JSON.parse(quizzes)
            .map((q) => (
              <QuizButton
                key={q.id}
                name={q.name}
                numberOfQuestions={q.questions.length}
                id={q.id}
                time={getQuizTotalTime(q)}
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
            openQuestionDialog={() => setShowUploadDialog(true)}
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
      <UploadQuestionDialog
        open={showUploadDialog}
        token={token}
        handleClose={() => setShowUploadDialog(false)}
        fetchQuizzes={fetchQuizzes}
      />
    </div>
  );
}

Dashboard.propTypes = {
  token: PropTypes.string.isRequired,
};
export default Dashboard;
