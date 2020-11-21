import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import { putPlayerAnswer } from '../api';

const useStyles = makeStyles({
  root: {

  },
});

function GamePanel(props) {
  const classes = useStyles();
  const {
    answers,
    points,
    question,
    playerID,
    answer,
  } = props;
  const [answerIds, setAnswerIds] = React.useState([]);

  React.useEffect(() => {
    if (answerIds.length !== 0) {
      putPlayerAnswer(playerID, answerIds).then((r) => {
        console.log(r);
      });
    }
  }, [answerIds, playerID]);

  const selectAnswer = (indx) => {
    setAnswerIds([...answerIds, indx]);
  };
  return (
    <div className={classes.root}>
      <Typography variant="h1">{question}</Typography>
      {answers.map((ans, indx) => (
        <Button variant="contained" color="primary" onClick={() => selectAnswer(indx)} key={ans}>{ans}</Button>
      ))}
      <Typography variant="h1">{`Points: ${points}`}</Typography>
      {answer !== null && <Typography variant="h1">{`Answer: ${answer}`}</Typography>}
    </div>
  );
}

GamePanel.propTypes = {
  answers: PropTypes.instanceOf(Array).isRequired,
  points: PropTypes.number.isRequired,
  question: PropTypes.string.isRequired,
  playerID: PropTypes.string.isRequired,
  answer: PropTypes.string.isRequired,
};

export default GamePanel;
