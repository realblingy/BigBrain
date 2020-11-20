import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import { getPlayerQuestion, getPlayerStatus } from '../api';
import GamePanel from '../components/GamePanel';

function Game() {
  const { quizID, playerID } = useParams();
  const [errMsg, setErrMsg] = React.useState('');
  const [currQuestion, setCurrQuestion] = React.useState(null);

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
    <div>
      <Typography>{errMsg}</Typography>
      {currQuestion !== null
      && (
        <GamePanel
          answers={currQuestion.answers}
          correctAnswers={currQuestion.correctAnswers}
          isoTimeLastQuestionStarted={currQuestion.isoTimeLastQuestionStarted}
          points={currQuestion.points}
          question={currQuestion.question}
          timer={currQuestion.timer}
          playerID={playerID}
          quizID={quizID}
          setCurrQuestion={setCurrQuestion}
        />
      )}
    </div>
  );
}

export default Game;
