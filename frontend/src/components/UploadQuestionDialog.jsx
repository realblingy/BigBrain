import React from 'react';
import PropTypes from 'prop-types';
import {
  Button, Dialog, DialogActions,
  DialogContent, DialogContentText,
} from '@material-ui/core';
import { useDropzone } from 'react-dropzone';
import PublishIcon from '@material-ui/icons/Publish';
import { uploadQuiz } from '../api';
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/void-dom-elements-no-children */
/* eslint-disable react/jsx-boolean-value */

const baseStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  padding: '20px',
  borderWidth: 2,
  borderRadius: 2,
  borderColor: '#eeeeee',
  borderStyle: 'dashed',
  backgroundColor: '#fafafa',
  color: '#bdbdbd',
  outline: 'none',
  transition: 'border .24s ease-in-out',
  cursor: 'pointer',
  height: 200,
};
const activeStyle = {
  borderColor: '#2196f3',
};
const acceptStyle = {
  borderColor: '#00e676',
};
const rejectStyle = {
  borderColor: '#ff1744',
};

function UploadQuestionDialog(props) {
  const {
    open,
    handleClose,
    token,
    fetchQuizzes,
  } = props;
  const [quizFile, setQuizFile] = React.useState(null);

  const uploadQuizFile = async (file) => {
    const fr = new FileReader();
    let result;
    fr.onload = async (e) => {
      try {
        result = await JSON.parse(e.target.result);
        const properties = ['active', 'createdAt', 'name', 'oldSessions', 'owner', 'questions', 'thumbnail'];
        properties.forEach((property) => {
          if (!Object.prototype.hasOwnProperty.call(result, property)) {
            throw new Error('NOT A QUIZ FILE');
          }
        });
        setQuizFile(result);
      } catch (error) {
        console.log(error);
      }
    };

    fr.readAsText(file);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: 'application/JSON',
    maxFiles: 1,
    onDrop: async (acceptedFiles) => {
      uploadQuizFile(acceptedFiles[0]).catch((e) => {
        console.log(e);
      });
    },
  });

  const style = React.useMemo(() => ({
    ...baseStyle,
    ...(isDragActive ? activeStyle : {}),
    ...(isDragAccept ? acceptStyle : {}),
    ...(isDragReject ? rejectStyle : {}),
  }), [
    isDragActive,
    isDragReject,
    isDragAccept,
  ]);

  const handleUploadedCancelBtnClick = () => {
    handleClose();
    setQuizFile(null);
  };

  const handleUploadBtnClick = async () => {
    uploadQuiz(token, quizFile)
      .then(() => {
        handleUploadedCancelBtnClick();
        fetchQuizzes(token);
      })
      .catch((error) => {
        console.log(error);
      });
  };

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
        {
        quizFile !== null
          ? (
            <>
              <DialogContentText>
                <h2 style={{ color: 'black' }}>{quizFile.name}</h2>
                <p style={{ color: 'black' }}>
                  Owner:
                  {` ${quizFile.owner}`}
                </p>
                <p style={{ color: 'black' }}>{`Questions: ${quizFile.questions.length}`}</p>
              </DialogContentText>
              <DialogActions>
                <Button color="primary" onClick={handleUploadedCancelBtnClick}>
                  Cancel
                </Button>
                <Button variant="contained" color="primary" autoFocus onClick={handleUploadBtnClick}>
                  Upload
                </Button>
              </DialogActions>
            </>
          )
          : (
            <>
              <DialogContentText>
                Upload your quiz file here
              </DialogContentText>
              <div {...getRootProps({ style })}>
                <input accept="application/JSON" type="file" {...getInputProps()} />
                <p>Drag n drop your file here, or click to select file</p>
                <PublishIcon />
              </div>
              <DialogActions>
                <Button color="primary" autoFocus onClick={handleClose}>
                  Cancel
                </Button>
              </DialogActions>
            </>
          )
        }
      </DialogContent>
    </Dialog>
  );
}

UploadQuestionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
  fetchQuizzes: PropTypes.func.isRequired,
};

export default UploadQuestionDialog;
