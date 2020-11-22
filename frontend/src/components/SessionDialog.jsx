import React, { useContext } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';
import { advanceQuizPost, getQuizData } from '../api';
import TokenContext from '../TokenContext';

function SessionDialog(props) {
  const { token } = useContext(TokenContext);
  const {
    open, handleClose, sessionID, quizID, setStart,
  } = props;
  const getUrl = window.location;
  const urlString = `${getUrl.origin}/play/${quizID}/${sessionID}`;
  const [copy, setCopy] = React.useState(false);
  const [err, setErr] = React.useState('');

  const startSession = async () => {
    try {
      await advanceQuizPost(token, quizID);
      const response = await getQuizData(quizID, token);
      if (response.active === null) {
        setErr('NOT ENOUGH QUESTIONS');
        return;
      }
      setStart(false);
    } catch (error) {
      console.log(error);
    }
  };

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopy(true);
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    } catch (error) {
      console.log('fail copied');
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          handleClose();
          setErr('');
        }}
        aria-labelledby="alert-dialog-slide-title"
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          style: {
            background: 'white',
          },
        }}
      >
        <Slide direction="down" in={copy} mountOnEnter unmountOnExit>
          <DialogTitle style={{
            fontSize: 12, paddingLeft: 22, marginBottom: 0, paddingBottom: 0,
          }}
          >
            Link is Copied!
          </DialogTitle>
        </Slide>
        <DialogTitle id="alert-dialog-slide-title">{`SESSION ${sessionID}`}</DialogTitle>
        <DialogTitle style={{
          color: 'red',
          margin: 0,
          padding: 0,
          paddingLeft: 20,
        }}
        >
          {` ${err}`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {urlString}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => copyToClipBoard(urlString)} color="primary">
            Copy Link
          </Button>
          <Button onClick={startSession} color="primary">
            Start Session
          </Button>
          <Button
            onClick={() => {
              handleClose();
              setErr('');
            }}
            color="primary"
          >
            Exit
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

SessionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sessionID: PropTypes.number,
  quizID: PropTypes.number,
  setStart: PropTypes.func.isRequired,
};

SessionDialog.defaultProps = {
  sessionID: null,
  quizID: null,
};

export default SessionDialog;
