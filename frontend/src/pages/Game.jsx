import React from 'react';
import Typography from '@material-ui/core/Typography';
import { useParams } from 'react-router-dom';
import { getPlayerQuestion } from '../api';

function Game() {
  const { playerID } = useParams();
  const [errMsg, setErrMsg] = React.useState('');

  React.useEffect(() => {
    // getPlayerStatus(playerID).then((r) => {
    //   console.log(r);
    // });
    const constantFetch = setInterval(() => {
      getPlayerQuestion(playerID).then((r) => {
        console.log(r);
        setErrMsg('GAME STARTED!');
        clearInterval(constantFetch);
      }).catch((err) => {
        setErrMsg(err.message);
      });
    }, 1000);
  });

  return (
    <div>
      game
      <Typography>{errMsg}</Typography>
    </div>
  );
}

export default Game;
