import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import TokenContext from '../TokenContext';
import {
  getPlayerQuestion, getPlayerStatus, advanceQuizPost, getPlayerAnswer,
} from '../api';
import GamePanel from '../components/GamePanel';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
  },
  waiting: {

  },
});
function Game() {
  const { token } = useContext(TokenContext);
  const classes = useStyles();
  const { quizID, playerID } = useParams();
  const [errMsg, setErrMsg] = React.useState('');
  const [countdown, setCountDown] = React.useState(null);
  const [countdownState, setCountDownState] = React.useState(true);
  const [currQuestion, setCurrQuestion] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);

  // Updates countdown every second
  React.useEffect(() => {
    const countDownInterval = setInterval(() => {
      if (currQuestion !== null && countdownState === true) {
        let targetTime = new Date(currQuestion.isoTimeLastQuestionStarted);
        targetTime = targetTime.getTime() + parseInt(currQuestion.timer, 10) * 1000 + 1;
        const currTime = new Date();
        const timeDiff = Math.ceil((targetTime - currTime.getTime()) / 1000);
        setCountDown(timeDiff);
      }
    }, 1000);
    return () => {
      clearInterval(countDownInterval);
    };
  });

  const showAnswerAdvance = React.useCallback(
    async (question) => {
      // set and show answer
      const response = await getPlayerAnswer(playerID);
      const idsAnswer = response.answerIds;
      let stringAns = '';
      idsAnswer.forEach((id) => {
        stringAns += `, ${question.answers[id]}`;
      });
      setAnswer(stringAns.slice(1, stringAns.length));

      // after 3 seconds, load next question and set answer to null
      await new Promise((resolve) => setTimeout(async () => {
        setAnswer(null);
        // TODO advance only if not last question
        const advanceQuizPostRes = await advanceQuizPost(token, quizID);
        const nextQuestion = await getPlayerQuestion(playerID);
        setCurrQuestion(nextQuestion.question);
        resolve();
      }, 3000));
    },
    [playerID, quizID, token],
  );

  // Loading new questions enables countdown
  React.useEffect(() => {
    if (currQuestion !== null) {
      let targetTime = new Date(currQuestion.isoTimeLastQuestionStarted);
      targetTime = targetTime.getTime() + parseInt(currQuestion.timer, 10) * 1000 + 1;
      const currTime = new Date();
      const timeDiff = Math.ceil((targetTime - currTime.getTime()) / 1000);
      setCountDown(timeDiff);
      setCountDownState(true);
    }
  }, [currQuestion]); //eslint-disable-line

  // Once countdown goes to 0, disable countdown --> show answer --> advance to next question
  React.useEffect(() => {
    if (countdown === 0) {
      // stop countdown
      setCountDownState(false);
      // show answer and advance to next question
      showAnswerAdvance(currQuestion);
    }
  }, [countdown, showAnswerAdvance]); //eslint-disable-line

  React.useEffect(() => {
    const constantFetch = setInterval(() => {
      getPlayerStatus(playerID).then((r) => {
        if (r.started === true) {
          getPlayerQuestion(playerID).then((res) => {
            setErrMsg('');
            setCurrQuestion(res.question);
          });
          clearInterval(constantFetch);
        } else {
          setErrMsg('Waiting for host');
        }
      });
    }, 1000);
  }, [playerID]);

  return (
    <div className={classes.body}>
      <Typography variant="h1">{errMsg}</Typography>
      {currQuestion !== null
      && (
        <GamePanel
          answers={currQuestion.answers}
          points={currQuestion.points}
          question={currQuestion.question}
          playerID={playerID}
          answer={answer}
        />
      )}
      {countdownState && <Typography variant="h2">{countdown}</Typography>}
    </div>
  );
}

export default Game;
