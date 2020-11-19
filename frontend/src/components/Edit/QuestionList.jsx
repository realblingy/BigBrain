import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/styles';
import {
  Container, List, ListItem, IconButton, Button,
} from '@material-ui/core';
import AddCircleIcon from '@material-ui/icons/AddCircle';
import DeleteIcon from '@material-ui/icons/Delete';
// import EditIcon from '@material-ui/icons/Edit';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
  },
  questionContainer: {
    border: 'solid black 1px',
    marginBottom: '1rem',
  },
  deleteBtn: {
    position: 'absolute',
    right: '5%',
  },
  editBtn: {
    position: 'absolute',
    right: '5%',
  },
  questionBtn: {
    fontSize: '1.3em',
    fontWeight: 300,
  },
  addQuestionBtn: {
    width: '100%',
  },
});

function QuestionList(props) {
  const {
    questions,
    handleDeleteClick,
    handleAddClick,
    handleQuestionClick,
  } = props;
  const classes = useStyles();

  return (
    <Container>
      <List component="nav">
        {(questions.length > 0)
          && questions.map((q, idx) => (
            <ListItem
              key={q.id}
              className={classes.questionContainer}
              button
              onClick={() => handleQuestionClick(idx)}
            >
              <p className={classes.questionBtn}>{q.question}</p>
              <IconButton
                color="secondary"
                className={classes.deleteBtn}
                onClick={() => handleDeleteClick(idx)}
              >
                <DeleteIcon />
              </IconButton>
            </ListItem>
          ))}
      </List>
      <Button
        variant="contained"
        color="primary"
        endIcon={<AddCircleIcon />}
        onClick={handleAddClick}
        className={classes.addQuestionBtn}
      >
        Add A Question
      </Button>
    </Container>
  );
}

QuestionList.propTypes = {
  questions: PropTypes.instanceOf(Array).isRequired,
  handleDeleteClick: PropTypes.func.isRequired,
  handleAddClick: PropTypes.func.isRequired,
  handleQuestionClick: PropTypes.func.isRequired,
};

export default QuestionList;
