import { Button, makeStyles, TextField } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  getVideo: {
    display: 'flex',
    flexDirection: 'row',
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
});

function QuestionVideoForm() {
  const classes = useStyles();
  const [videoURL, setVideoURL] = React.useState('');
  const [iframeURL, setIframeURL] = React.useState(null);
  const [videoURLError, setVideoURLError] = React.useState(false);

  const handleURLTextFieldChange = (e) => {
    setVideoURL(e.target.value);
    if (videoURLError) {
      setVideoURLError(false);
    }
    if (iframeURL !== null) {
      setIframeURL(null);
    }
  };

  const handleGetVideoBtnClick = () => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = videoURL.match(regExp);

    if (match && match[2].length === 11) {
      setIframeURL(match[2]);
      setVideoURL(false);
      console.log(match[2]);
    } else {
      setVideoURLError(true);
      setIframeURL(null);
    }
  };

  return (
    <>
      {iframeURL
      && (
        <iframe
          title="Youtube Player"
          width="560"
          height="315"
          src={`//www.youtube.com/embed/${iframeURL}`}
          allowFullScreen
          frameBorder="0"
        />
      )}
      <div className={classes.getVideo}>
        <TextField
          className={classes.TextField}
          variant="outlined"
          placeholder="Enter the Youtube video's URL"
          error={videoURLError}
          helperText={videoURLError && 'URL is not a valid Youtube link. Please try again.'}
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

export default QuestionVideoForm;
