import {
  FormControl, Button,
  FormControlLabel, InputLabel, Radio, RadioGroup, NativeSelect,
  TextField, IconButton, List, ListItem, ListItemText, ListItemSecondaryAction, Checkbox,
  ButtonGroup,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
import React from 'react';
import QuestionImageForm from './QuestionImageForm';
import QuestionVideoForm from './QuestionVideoForm';

const useStyles = makeStyles((theme) => ({
  root: {
    paddingBottom: '2rem',
  },
  radioGroup: {
    display: 'flex',
    flexDirection: 'row',
  },
  timerMenu: {
    minWidth: 120,
    marginBottom: '1rem',
  },
  textField: {
    minWidth: 500,
    maxWidth: 650,
    [theme.breakpoints.down(600)]: {
      minWidth: 300,
    },
  },
  questionForm: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'space-evenly',
  },
  selectMenu: {
    maxWidth: 100,
  },
  newAnswerField: {
    display: 'flex',
    flexDirection: 'row',
  },
  answersList: {
    maxWidth: 600,
  },
  answerListItem: {
    borderRadius: '1%',
  },
  bottomButtonGroup: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: '1rem',
    width: '100%',
    [theme.breakpoints.down(600)]: {
      marginTop: '2rem',
    },
  },
}));

/**
 * Users can make their questions for a game with this form. Should only be used
 * in the Edit section.
 * @param {*} props
 */
function QuestionForm(props) {
  const {
    submitForm,
    cancel,
    questionObj,
    action,
  } = props;

  const classes = useStyles();
  const [question, setQuestion] = React.useState('');
  const [answers, setAnswers] = React.useState([]);
  const [answerQty, setAnswerQty] = React.useState('single');
  const [addedMediaFormat, setAddedMediaFormat] = React.useState('none');
  const [correctAnswers, setCorrectAnswers] = React.useState([]);
  const [timer, setTimer] = React.useState(15);
  const [points, setPoints] = React.useState(10);
  const [newAnswer, setNewAnswer] = React.useState('');
  const [answerFieldError, setAnswerFieldError] = React.useState(false);
  const [questionFieldError, setQuestionFieldError] = React.useState(false);
  const [mediaError, setMediaError] = React.useState(false);
  const [youtubeURL, setYoutubeURL] = React.useState(null);
  const [imageData, setImageData] = React.useState('#');

  React.useEffect(() => {
    // Checks if the question object is === {}. If not true, we add the appropriate
    // fields into our states
    if (Object.keys(questionObj).length !== 0 && questionObj.constructor === Object) {
      setQuestion(questionObj.question);
      setAnswers(questionObj.answers);
      setCorrectAnswers(questionObj.correctAnswers);
      const mediaObj = questionObj.media;
      setAddedMediaFormat(mediaObj.format);
      switch (mediaObj.format) {
        case 'video':
          setYoutubeURL(mediaObj.data);
          break;
        case 'image':
          setImageData(mediaObj.data);
          break;
        default:
          break;
      }
    }
  }, [questionObj]);
  // For the first answer, it will automatically be a correct answer
  // This disables users having 0 correct answers
  React.useEffect(() => {
    if (answers.length === 1) {
      setCorrectAnswers([...answers]);
    }
  }, [answers]);

  // If the answerQty is ever changed back to single, the first
  // answer will be the correct one
  React.useEffect(() => {
    if (answerQty === 'single' && answers.length > 0) {
      setCorrectAnswers([answers[0]]);
    }
  }, [answerQty, answers]);
  // Adds an answer to the answer list
  // Will prompt an error if it is a duplicate answer.
  // Empty answers are allowed.
  const handleAddIconClick = () => {
    let fieldError = false;
    const trimmedNewAnswer = newAnswer.trim();
    answers.forEach((ans) => {
      if (ans === trimmedNewAnswer) {
        setAnswerFieldError('Cannot have duplicated answers!');
        fieldError = true;
      }
    });
    if (!fieldError) {
      setAnswers((oldAnswers) => [...oldAnswers, trimmedNewAnswer]);
      setNewAnswer('');
    }
  };
  // Changing the answer field will turn off the field error
  const handleNewAnswerFieldChange = (e) => {
    if (answerFieldError) {
      setAnswerFieldError(false);
    }
    setNewAnswer(e.target.value);
  };
  // Determines if the question is single or multi
  const handleQuantityAnswerRadioGroup = (e) => {
    setAnswerQty(e.target.value);
  };
  // Deletes an answer from the answers list
  const handleDeleteAnswerClick = (answerIdx) => {
    const answersArray = [...answers];
    answersArray.splice(answerIdx, 1);
    setAnswers(answersArray);
  };
  // Adds an answer to the correct answers array
  const handleCheckboxAnswerClick = (answerIdx) => {
    const correctAnswersArray = [...correctAnswers];
    const answer = answers[answerIdx];

    if (answerQty === 'multi') {
      if (correctAnswersArray.includes(answer)) {
        setCorrectAnswers(correctAnswersArray.filter((ans) => ans !== answer));
      } else {
        correctAnswersArray.push(answer);
        setCorrectAnswers(correctAnswersArray);
      }
    } else {
      setCorrectAnswers([answer]);
    }
  };
  // Checks if an answer is correct
  const isCorrectAnswer = (answerIdx) => {
    const answer = answers[answerIdx];
    if (correctAnswers.includes(answer)) {
      return true;
    }
    return false;
  };
  // Sets the media format : 'None', 'Image', 'Youtube'
  const handleMediaFormatRadioGroup = (e) => {
    if (e.target.value !== addedMediaFormat) {
      setMediaError(false);
    }
    setAddedMediaFormat(e.target.value);
  };
  // Retrieves media data based on the current format
  const getMediaData = () => {
    switch (addedMediaFormat) {
      case 'image':
        return imageData;
      case 'video':
        return youtubeURL;
      default:
        return {};
    }
  };
  // Submits the Question form
  const handleAddQuestionBtnClick = (e) => {
    e.preventDefault();
    if (question.trim().length === 0) {
      setQuestionFieldError('Question cannot be empty!');
    }
    if (answers.length < 2) {
      setAnswerFieldError('Must have at least two answers');
    }
    switch (addedMediaFormat) {
      case 'image':
        if (imageData === '#') {
          setMediaError(true);
          return;
        }
        break;
      case 'video':
        if (youtubeURL === null) {
          setMediaError(true);
          return;
        }
        break;
      default:
        break;
    }
    if (question.trim().length !== 0 && answers.length >= 2 && !mediaError) {
      submitForm({
        question,
        answers,
        correctAnswers,
        timer,
        points,
        answerQty,
        media: {
          format: addedMediaFormat,
          data: getMediaData(),
        },
      });
    }
  };
  // Checks for errors for the question field
  const handleQuestionFieldChange = (e) => {
    setQuestion(e.target.value);
    if (questionFieldError) {
      setQuestionFieldError(false);
    }
  };
  // Sets the points for the question
  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };
  // Sets the timer for the question
  const handleTimerChange = (e) => {
    setTimer(e.target.value);
  };

  return (
    <div className={classes.root}>
      <form className={classes.questionForm}>
        <TextField
          className={classes.textField}
          label="Question"
          variant="outlined"
          value={question}
          error={questionFieldError !== false}
          helperText={questionFieldError !== false && questionFieldError}
          onChange={handleQuestionFieldChange}
          required
          inputProps={{ maxLength: 50, 'aria-label': 'Question Field' }}
        />
        <RadioGroup className={classes.radioGroup}>
          <FormControlLabel value="single" onClick={handleQuantityAnswerRadioGroup} checked={answerQty === 'single'} label="Single Answer" control={<Radio />} />
          <FormControlLabel value="multi" onClick={handleQuantityAnswerRadioGroup} checked={answerQty === 'multi'} label="Multi Answer" control={<Radio />} />
        </RadioGroup>
        <FormControl className={classes.timerMenu}>
          <InputLabel htmlFor="outlined-timer-native-simple">Timer (seconds)</InputLabel>
          <NativeSelect
            id="demo-simple-select-helper"
            inputProps={{
              name: 'quizTimer',
              id: 'outlined-timer-native-simple',
              'aria-label': 'timer',
            }}
            className={classes.selectMenu}
            onChange={handleTimerChange}
          >
            <option value={10}>15</option>
            <option value={20}>30</option>
            <option value={30}>45</option>
            <option value={40}>60</option>
          </NativeSelect>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="outlined-points-native-simple" className={classes.selectMenu}>Points</InputLabel>
          <NativeSelect
            id="demo-simple-select-helper"
            className={classes.selectMenu}
            inputProps={{
              name: 'points',
              id: 'outlined-points-native-simple',
              'aria-label': 'points',
            }}
            onChange={handlePointsChange}
          >
            <option value={10}>10</option>
            <option value={20}>20</option>
            <option value={30}>40</option>
            <option value={40}>80</option>
          </NativeSelect>
        </FormControl>
        <h2>Answers</h2>
        <div>
          <div className={classes.newAnswer}>
            {
              answers.length < 6
                ? (
                  <>
                    <TextField
                      value={newAnswer}
                      error={answerFieldError !== false}
                      onChange={handleNewAnswerFieldChange}
                      variant="outlined"
                      helperText={answerFieldError !== false && answerFieldError}
                      className={classes.textField}
                      placeholder="Give an answer"
                      inputProps={{ maxLength: 30, 'aria-label': 'Give an answer' }}
                    />
                    <IconButton aria-label="Add Question" onClick={handleAddIconClick}>
                      <AddCircleIcon style={{ color: 'green' }} />
                    </IconButton>
                  </>
                ) : <p>Maximum questions reached. Delete a question to add more.</p>
            }
          </div>
          <List className={classes.answersList}>
            {answers.map((answer, idx) => (
              <ListItem key={answer} className={classes.answerListItem}>
                <ListItemText>{answer}</ListItemText>
                <Checkbox
                  checked={isCorrectAnswer(idx)}
                  onClick={() => handleCheckboxAnswerClick(idx)}
                />
                <ListItemSecondaryAction>
                  <IconButton onClick={() => handleDeleteAnswerClick(idx)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
        <div>
          <h2>Add an image or Youtube link?</h2>
          <RadioGroup
            inputProps={{ 'arial-label': 'Media format' }}
            className={classes.radioGroup}
          >
            <FormControlLabel
              value="none"
              label="None"
              onClick={handleMediaFormatRadioGroup}
              checked={addedMediaFormat === 'none'}
              control={<Radio />}
            />
            <FormControlLabel
              value="image"
              label="Image"
              onClick={handleMediaFormatRadioGroup}
              checked={addedMediaFormat === 'image'}
              control={<Radio />}
            />
            <FormControlLabel
              value="video"
              label="Youtube Video"
              onClick={handleMediaFormatRadioGroup}
              checked={addedMediaFormat === 'video'}
              control={<Radio />}
            />
          </RadioGroup>
        </div>
        {(addedMediaFormat === 'image') && (
          <QuestionImageForm
            imageData={imageData}
            setImageData={setImageData}
            setError={setMediaError}
            error={mediaError}
          />
        )}
        {(addedMediaFormat === 'video') && (
          <QuestionVideoForm
            youtubeURL={youtubeURL}
            setYoutubeURL={setYoutubeURL}
            setError={setMediaError}
            error={mediaError}
          />
        )}
        <ButtonGroup
          className={classes.bottomButtonGroup}
        >
          <Button
            type="submit"
            onClick={handleAddQuestionBtnClick}
            style={{ backgroundColor: '#212032', color: 'white', marginRight: '1rem' }}
            aria-label="Submit Changes"
          >
            {action === 'edit' ? 'Save Changes' : 'Add Question'}
          </Button>
          <Button
            type="button"
            style={{ backgroundColor: '#af0404', color: 'white' }}
            onClick={cancel}
            aria-label="Cancel Changes"
          >
            Cancel
          </Button>
        </ButtonGroup>
      </form>
    </div>
  );
}

QuestionForm.propTypes = {
  submitForm: PropTypes.func.isRequired,
  cancel: PropTypes.func.isRequired,
  questionObj: PropTypes.objectOf(PropTypes.object),
  action: PropTypes.string.isRequired,
};

QuestionForm.defaultProps = {
  questionObj: {},
};

export default QuestionForm;
