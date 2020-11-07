import { ButtonBase, makeStyles } from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

const useStyles = makeStyles(() => ({
  root: {
    height: 200,
    width: 300,
    borderRadius: '3%',
    border: 'solid black 1px',
  },
  name: {
    color: 'white',
  },
  subHeadings: {
    color: 'white',
    position: 'absolute',
    bottom: '5%',
  },
  image: {
    postion: 'relative',
  },
}));

function QuizButton(props) {
  const classes = useStyles();
  const { color, name, numberOfQuestions } = props;

  return (
    <ButtonBase
      focusRipple
      className={classes.root}
      variant="contained"
      style={{ backgroundColor: color }}
    >
      <h1 className={classes.name}>
        { name }
      </h1>
      <h4
        className={classes.subHeadings}
        style={{ right: '5%' }}
      >
        Questions:
        {numberOfQuestions}
      </h4>
      <h4
        className={classes.subHeadings}
        style={{ left: '5%' }}
      >
        Total Time:
      </h4>
    </ButtonBase>
  );
}

QuizButton.propTypes = {
  color: PropTypes.string,
  name: PropTypes.func.isRequired,
  numberOfQuestions: PropTypes.func.isRequired,
};

QuizButton.defaultProps = {
  color: 'orange',
};

export default QuizButton;
