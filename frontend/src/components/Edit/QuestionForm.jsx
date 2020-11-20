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

const useStyles = makeStyles({
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
    minWidth: 800,
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
  },
});

function QuestionForm(props) {
  const { submitForm, cancel, questionObj } = props;

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

  React.useEffect(() => {
    if (answers.length === 1) {
      setCorrectAnswers([...answers]);
    }
  }, [answers]);

  React.useEffect(() => {
    if (answerQty === 'single' && answers.length > 0) {
      setCorrectAnswers([answers[0]]);
    }
  }, [answerQty, answers]);

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

  const handleNewAnswerFieldChange = (e) => {
    if (answerFieldError) {
      setAnswerFieldError(false);
    }
    setNewAnswer(e.target.value);
  };

  const handleQuantityAnswerRadioGroup = (e) => {
    setAnswerQty(e.target.value);
  };

  const handleDeleteAnswerClick = (answerIdx) => {
    const answersArray = [...answers];
    answersArray.splice(answerIdx, 1);
    setAnswers(answersArray);
  };

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

  const isCorrectAnswer = (answerIdx) => {
    const answer = answers[answerIdx];
    if (correctAnswers.includes(answer)) {
      return true;
    }
    return false;
  };

  const handleMediaFormatRadioGroup = (e) => {
    if (e.target.value !== addedMediaFormat) {
      setMediaError(false);
    }
    setAddedMediaFormat(e.target.value);
  };

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

  const handleQuestionFieldChange = (e) => {
    setQuestion(e.target.value);
    if (questionFieldError) {
      setQuestionFieldError(false);
    }
  };

  const handlePointsChange = (e) => {
    setPoints(e.target.value);
  };

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
        />
        <RadioGroup className={classes.radioGroup}>
          <FormControlLabel value="single" onClick={handleQuantityAnswerRadioGroup} checked={answerQty === 'single'} label="Single Answer" control={<Radio />} />
          <FormControlLabel value="multi" onClick={handleQuantityAnswerRadioGroup} checked={answerQty === 'multi'} label="Multi Answer" control={<Radio />} />
        </RadioGroup>
        <FormControl className={classes.timerMenu}>
          <InputLabel htmlFor="outlined-age-native-simple">Timer (seconds)</InputLabel>
          <NativeSelect
            // labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            inputProps={{
              name: 'quizTimer',
              id: 'outlined-age-native-simple',
            }}
            className={classes.selectMenu}
            onChange={handleTimerChange}
          >
            <option value={15}>15</option>
            <option value={30}>30</option>
            <option value={45}>45</option>
            <option value={60}>60</option>
          </NativeSelect>
        </FormControl>
        <FormControl>
          <InputLabel htmlFor="outlined-age-native-simple" className={classes.selectMenu}>Points</InputLabel>
          <NativeSelect
            // labelId="demo-simple-select-helper-label"
            id="demo-simple-select-helper"
            className={classes.selectMenu}
            inputProps={{
              name: 'quizTimer',
              id: 'outlined-age-native-simple',
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
                    />
                    <IconButton onClick={handleAddIconClick}>
                      <AddCircleIcon style={{ color: 'green' }} />
                    </IconButton>
                  </>
                ) : <p>Maximum questions reached. Delete a question to add more.</p>
            }
          </div>
          {/* <label htmlFor="answersList">Tick indicates the answer is correct</label> */}
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
          <RadioGroup className={classes.radioGroup}>
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
          >
            {questionObj !== null ? 'Save Changes' : 'Add Question'}
          </Button>
          <Button
            type="button"
            style={{ backgroundColor: '#af0404', color: 'white' }}
            onClick={cancel}
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
};

QuestionForm.defaultProps = {
  questionObj: {},
};

export default QuestionForm;
