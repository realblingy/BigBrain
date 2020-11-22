import React from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/styles';
import { Typography } from '@material-ui/core';
import { getPlayerResults } from '../api';

const useStyles = makeStyles({
  body: {
    display: 'flex',
    flexDirection: 'column',
  },
});

function PlayerResults() {
  const classes = useStyles();
  const { playerID } = useParams();
  const [results, setResults] = React.useState([]);
  const [numQuestions, setNumQuestions] = React.useState(null);
  const [numCorrect, setNumCorrect] = React.useState(null);

  const resultsRequest = async () => {
    const res = await getPlayerResults(playerID);
    setResults(res);
    setNumQuestions(res.length);
    const correct = res.reduce((prev, curr) => curr.correct ? prev + 1 : prev , 0); // eslint-disable-line
    setNumCorrect(correct);
  };

  React.useEffect(() => {
    resultsRequest();
  });

  return (
    <div className={classes.body}>
      <Typography variant="h1">Your Results</Typography>
      {results.length !== 0
      // eslint-disable-next-line
        && results.map((result, indx) => <Typography variant="h3" key={`${indx}${result.correct}`}>{`Question ${indx + 1}: ${result.correct === true ? 'correct' : 'incorrect'}`}</Typography>)} 
      {numQuestions !== null && numCorrect !== null && <Typography variant="h3">{`Final Mark: ${numCorrect}/${numQuestions}`}</Typography>}
    </div>
  );
}

export default PlayerResults;
