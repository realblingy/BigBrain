import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import { useParams, useHistory } from 'react-router-dom';
import TokenContext from '../TokenContext';
import {
  getPlayerQuestion, getPlayerStatus, getPlayerAnswer,
  getSessionStatus, getQuizData,
} from '../api';
import GamePanel from '../components/GamePanel';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '80vh',
    flexDirection: 'column',
  },
  waiting: {

  },
});
function Game() {
  const { token } = useContext(TokenContext);
  const classes = useStyles();
  const history = useHistory();
  const { quizID, sessionID, playerID } = useParams();
  const [errMsg, setErrMsg] = React.useState('');
  const [countdown, setCountDown] = React.useState(null);
  const [countdownState, setCountDownState] = React.useState(true);
  const [currQuestion, setCurrQuestion] = React.useState(null);
  const [answer, setAnswer] = React.useState(null);
  const [disableBtn, setDisabledBtn] = React.useState(false);

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
      if (question === null) {
        return;
      }
      const response = await getPlayerAnswer(playerID);
      const idsAnswer = response.answerIds;
      if (idsAnswer === undefined) {
        return;
      }
      let stringAns = '';
      idsAnswer.forEach((id) => {
        stringAns += `, ${question.answers[id]}`;
      });
      setAnswer(stringAns.slice(1, stringAns.length));
      setDisabledBtn(true);
    },
    [playerID],  //eslint-disable-line
  );

  // Loading new questions enables countdown
  React.useEffect(() => {
    if (currQuestion !== null) {
      setDisabledBtn(false);
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
    if (countdown <= 0) {
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
      }).catch((err) => {
        console.log(err);
        clearInterval(constantFetch);
      });
    }, 1000);
    return () => {
      clearInterval(constantFetch);
    };
  }, [playerID]);

  // Get session status (checking if admin closed the game)
  React.useEffect(() => {
    let position = null;
    const checkSessionStatus = setInterval(async () => {
      const sessionStatus = await getSessionStatus(token, sessionID);
      const quizData = await getQuizData(quizID, token);
      if (!sessionStatus.results.active) {
        setCurrQuestion(null);
        // setErrMsg('Game Ended');
        history.push(`/playerResults/${quizID}/${playerID}`);
        setCountDownState(false);
      }

      console.log('HIII', sessionStatus.results.position, position);
      if (sessionStatus.results.position !== position && position !== null
        && sessionStatus.results.position !== quizData.questions.length) {
        // get new questions
        const nextQuestion = await getPlayerQuestion(playerID);
        if (nextQuestion !== undefined) {
          setCurrQuestion(nextQuestion.question);
        }
      }
      // update position
      position = sessionStatus.results.position;
    }, 1000);
    return () => {
      clearInterval(checkSessionStatus);
    };
  }, [sessionID, token, history, quizID, playerID]);

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
          disableBtn={disableBtn}
        />
      )}
      {countdownState && <Typography variant="h2">{`Time Left: ${countdown}`}</Typography>}
    </div>
  );
}

export default Game;
