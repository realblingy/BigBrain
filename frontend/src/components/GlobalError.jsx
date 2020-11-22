import React from 'react';
import Alert from '@material-ui/lab/Alert';
import Snackbar from '@material-ui/core/Snackbar';
import PropTypes from 'prop-types';

function GlobalError(props) {
  const { errMsg, open, handleClose } = props;
  return (
    <div>
      <Snackbar anchorOrigin={{ vertical: 'top', horizontal: 'center' }} open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" onClose={handleClose}>{errMsg}</Alert>
      </Snackbar>
    </div>
  );
}

GlobalError.propTypes = {
  errMsg: PropTypes.string.isRequired,
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default GlobalError;
