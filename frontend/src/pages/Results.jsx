import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import { getSessionResults } from '../api';
import TokenContext from '../TokenContext';

function Results() {
  const { id } = useParams();
  const { token } = useContext(TokenContext);
  const [results, setResults] = React.useState([]); //eslint-disable-line

  React.useEffect(() => {
    getSessionResults(token, id).then((r) => setResults(r.results));
  });

  const getTopFive = (r) => { //eslint-disable-line
    // get the scores for each individual
    const scores = [];
    r.forEach((individual) => {
      let sum = 0;
      let score = {
        name: individual.name,
      };
      individual.answers.forEach((answer) => {
        if (answer.correct === true) {
          sum += 1;
        }
      });
      score = {
        ...score,
        score: sum,
      };
      scores.push(score);
    });
    console.log(scores);
    scores.sort((a, b) => b.score - a.score);
    return scores.slice(0, 5);
  };

  return (
    <div>
      <Typography variant="h1">RESULTS</Typography>
      <Typography variant="h2">TOP 5 USERS</Typography>
      {results !== [] && getTopFive(results).map((person) => <div>{`${person.name} got a score of ${person.score}`}</div>)}
    </div>
  );
}

export default Results;
