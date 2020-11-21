import { Button, makeStyles, TextField } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

const useStyles = makeStyles((theme) => ({
  getVideo: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: '1rem',
  },
  TextField: {
    minWidth: '80%',
  },
  getVideoBtn: {
    backgroundColor: 'green',
    color: 'white',
    '&:hover': {
      backgroundColor: 'darkgreen',
      color: 'white',
    },
  },
  iframe: {
    width: 560,
    height: 315,
    [theme.breakpoints.down(560)]: {
      width: 340,
      height: 180,
    },
  },
}));

function QuestionVideoForm(props) {
  const {
    youtubeURL,
    setYoutubeURL,
    setError,
    error,
  } = props;

  const classes = useStyles();
  const [videoURL, setVideoURL] = React.useState('');
  const handleURLTextFieldChange = (e) => {
    setVideoURL(e.target.value);
    if (youtubeURL !== null) {
      setYoutubeURL(null);
    }
  };

  const handleGetVideoBtnClick = () => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoURL.match(regExp);

    if (match && match[2].length === 11) {
      setYoutubeURL(match[2]);
      setError(false);
    } else {
      setError(true);
      setYoutubeURL(null);
    }
  };

  return (
    <>
      {youtubeURL
      && (
        <iframe
          title="Youtube Player"
          // width="560"
          // height="315"
          className={classes.iframe}
          src={`//www.youtube.com/embed/${youtubeURL}`}
          allowFullScreen
          frameBorder="0"
        />
      )}
      <div className={classes.getVideo}>
        <TextField
          value={videoURL}
          className={classes.TextField}
          variant="outlined"
          placeholder="Enter the Youtube video's URL"
          error={error}
          helperText={error && 'URL is not a valid Youtube link. Please try again.'}
          onChange={handleURLTextFieldChange}
        />
        <Button
          style={{ height: 50 }}
          onClick={handleGetVideoBtnClick}
          className={classes.getVideoBtn}
        >
          Get Video
        </Button>
      </div>
    </>
  );
}

QuestionVideoForm.propTypes = {
  youtubeURL: PropTypes.string,
  setYoutubeURL: PropTypes.func.isRequired,
  setError: PropTypes.func.isRequired,
  error: PropTypes.bool.isRequired,
};

QuestionVideoForm.defaultProps = {
  youtubeURL: null,
};

export default QuestionVideoForm;
