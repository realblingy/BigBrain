import React from 'react';
import { useParams } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import { getPlayerResults } from '../api';

function PlayerResults() {
  const { playerID } = useParams();
  const [results, setResults] = React.useState([]);

  const resultsRequest = async () => {
    const res = await getPlayerResults(playerID);
    setResults(res);
  };

  React.useEffect(() => {
    resultsRequest();
  });

  return (
    <div>
      {results.length !== 0
      // eslint-disable-next-line
        && results.map((result, indx) => <Typography key={`${indx}${result.correct}`}>{`Question ${indx + 1}: ${result.correct === true ? 'correct' : 'incorrect'}`}</Typography>)} 
    </div>
  );
}

export default PlayerResults;
