import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';
import PropTypes from 'prop-types';

function SessionDialog(props) {
  const { open, handleClose, sessionID } = props;
  const getUrl = window.location;
  const urlString = `${getUrl.origin}/play?sessionID=${sessionID}`;
  const [copy, setCopy] = React.useState(false);

  const copyToClipBoard = async (copyMe) => {
    try {
      await navigator.clipboard.writeText(copyMe);
      setCopy(true);
      setTimeout(() => {
        setCopy(false);
      }, 2000);
    } catch (err) {
      console.log('fail copied');
    }
  };

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
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
        <DialogTitle id="alert-dialog-slide-title">SESSION ID</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            {urlString}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => copyToClipBoard(urlString)} color="primary">
            Copy Link
          </Button>
          <Button onClick={handleClose} color="primary">
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
};

SessionDialog.defaultProps = {
  sessionID: null,
};

export default SessionDialog;
