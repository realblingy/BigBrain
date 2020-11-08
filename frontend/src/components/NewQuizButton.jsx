import { ButtonBase, makeStyles } from '@material-ui/core';
import AddCircleOutlineIcon from '@material-ui/icons/AddCircleOutline';
import React from 'react';

const useStyles = makeStyles(() => ({
  root: {
    height: 200,
    width: 300,
    borderRadius: '3%',
    border: 'dotted black 2px',
    backgroundColor: 'whitesmoke',
    display: 'flex',
    flexDirection: 'column',
  },
  name: {
    color: 'black',
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

function NewQuizButton() {
  const classes = useStyles();

  return (
    <ButtonBase
      focusRipple
      className={classes.root}
      variant="contained"
    >
      <h1 className={classes.name}>
        New Quiz
      </h1>
      <AddCircleOutlineIcon />
    </ButtonBase>
  );
}

export default NewQuizButton;
