import {
  Button, Dialog, DialogActions, DialogContent,
  DialogContentText,
} from '@material-ui/core';
import React from 'react';
import PropTypes from 'prop-types';

function DeleteQuestionDialog(props) {
  const { open, close, deleteGame } = props;

  return (
    <Dialog
      open={open}
      onClose={close}
      PaperProps={{
        style: {
          background: 'white',
        },
      }}
    >
      <DialogContent>
        <DialogContentText>
          Are you sure you want to delete this game? You cannot undo this action.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={close} color="secondary">
          Cancel
        </Button>
        <Button onClick={deleteGame} color="primary" autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

DeleteQuestionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  close: PropTypes.func.isRequired,
  deleteGame: PropTypes.func.isRequired,
};

export default DeleteQuestionDialog;
