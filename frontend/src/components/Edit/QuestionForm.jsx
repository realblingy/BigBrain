import {
  FormControl,
  FormControlLabel, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/styles';
import React from 'react';

const useStyles = makeStyles({
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  timerMenu: {
    minWidth: 120,
  },
});

function QuestionForm() {
  const classes = useStyles();

  return (
    <div>
      <h2>New Question</h2>
      <form>
        <TextField label="Question" variant="outlined" required />
        <RadioGroup className={classes.radioGroup}>
          <FormControlLabel value="single" label="Single Answer" control={<Radio />} />
          <FormControlLabel value="multi" label="Multi Answer" control={<Radio />} />
        </RadioGroup>
        <FormControl className={classes.timerMenu}>
          <InputLabel htmlFor="quizTimer">Timer</InputLabel>
          <Select
            inputProps={{
              name: 'quizTimer',
            }}
          >
            <MenuItem value={10}>10</MenuItem>
          </Select>
        </FormControl>
      </form>
    </div>
  );
}

export default QuestionForm;
