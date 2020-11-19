import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogActions,
  DialogContent, DialogContentText,
} from '@material-ui/core';
// import { useDropzone } from 'react-dropzone';

function UploadQuestionDialog(props) {
  const { open, handleClose } = props;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      PaperProps={{
        style: {
          background: 'white',
        },
      }}
    >
      <DialogContent>
        <DialogContentText>
          Upload your quiz file here
        </DialogContentText>
        <DialogActions>
          <Button color="primary" autoFocus onClick={handleClose}>
            Cancel
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  );
}

UploadQuestionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default UploadQuestionDialog;
