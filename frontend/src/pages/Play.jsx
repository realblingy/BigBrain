import React, { useRef } from 'react';
import { useParams } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import PlayForm from '../components/PlayForm';

const useStyles = makeStyles({
  root: {
    height: '94.6vh',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    transition: 'background-color 1s ease-in-out',
  },
});

function Play() {
  const classes = useStyles();
  const { quizId, id } = useParams();
  const rootRef = useRef(null);

  React.useEffect(() => {
    rootRef.current.style.backgroundColor = 'orange';
    let curCol = 0;
    const col = ['teal', 'green', 'purple', 'orange'];
    const timer = setInterval(() => {
      if (curCol === col.length) {
        curCol = 0;
      }
      rootRef.current.style.backgroundColor = col[curCol];
      curCol += 1;
    }, 7000);
    return () => {
      clearInterval(timer);
    };
  });

  return (
    <div className={classes.root} ref={rootRef}>
      <PlayForm quizId={quizId} id={id} />
    </div>
  );
}

export default Play;
