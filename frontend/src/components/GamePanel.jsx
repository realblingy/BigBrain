import React from 'react';
import { makeStyles } from '@material-ui/styles';
import PropTypes from 'prop-types';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import { putPlayerAnswer } from '../api';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  grid: {
    width: 600,
  },
  gridItem: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    height: 150,
    width: 300,
    fontSize: '2rem',
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
    disableBtn,
  } = props;
  const [answerIds, setAnswerIds] = React.useState([]);
  const [buttonStates, setButtonStates] = React.useState(Array(answers.length).fill(false));

  React.useEffect(() => {
    if (answerIds.length !== 0) {
      putPlayerAnswer(playerID, answerIds).then((r) => {
        console.log(r);
      });
    }
  }, [answerIds, playerID]);

  // Reset everything upon question change
  React.useEffect(() => {
    setButtonStates(Array(answers.length).fill(false));
    setAnswerIds([]);
  }, [question, answers]);

  const selectAnswer = (indx) => {
    // Toggling button from inactive to active
    const newButtonStates = buttonStates;
    newButtonStates[indx] = !newButtonStates[indx];
    setButtonStates([...newButtonStates]);

    if (newButtonStates[indx]) {
      // if inactive --> active, add to answerIds
      console.log([...answerIds, indx]);
      setAnswerIds([...answerIds, indx]);
    } else {
      // if active --> inactive, remove from answerIds
      const newAnswerIds = answerIds;
      newAnswerIds.splice(newAnswerIds.indexOf(indx), 1);
      console.log(newAnswerIds);
      setAnswerIds([...newAnswerIds]);
    }
  };
  return (
    <div className={classes.root}>
      <Typography variant="h1">{question}</Typography>
      <Grid className={classes.grid} container spacing={3}>
        {answers.map((ans, indx) => (
          <Grid className={classes.gridItem} xs={6} item>
            <Button className={classes.button} disabled={disableBtn} variant="contained" color={buttonStates[indx] === true ? 'secondary' : 'primary'} onClick={() => selectAnswer(indx)} key={ans}>{ans}</Button>
          </Grid>
        ))}
      </Grid>
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
  answer: PropTypes.string,
  disableBtn: PropTypes.bool.isRequired,
};

GamePanel.defaultProps = {
  answer: null,
};

export default GamePanel;
