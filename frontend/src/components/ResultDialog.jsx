import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogTitle from '@material-ui/core/DialogTitle';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

function ResultDialog(props) {
  const { open, handleClose, sessionID } = props;
  const history = useHistory();
  // const getUrl = window.location;
  // const urlString = `${getUrl.origin}/play?sessionID=${sessionID}`;
  const handleResults = () => {
    history.push(`/results/${sessionID}`);
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
        <DialogTitle id="alert-dialog-slide-title">{`Would you like to view the results of session ${sessionID}?`}</DialogTitle>
        <DialogActions>
          <Button onClick={handleResults} color="primary">
            Yes
          </Button>
          <Button onClick={handleClose} color="primary">
            No
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

ResultDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  sessionID: PropTypes.number,
};

ResultDialog.defaultProps = {
  sessionID: null,
};

export default ResultDialog;
