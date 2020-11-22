import React from 'react';
import { useHistory } from 'react-router-dom';
import {
  CircularProgress, IconButton,
  Container, Dialog, DialogContent, makeStyles, DialogActions, Button, TextField,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FaceIcon from '@material-ui/icons/Face';
import CloseIcon from '@material-ui/icons/Close';
import GlobalError from '../components/GlobalError';
import { getUser, updateUser } from '../api';
import ProfileImageEditor from '../components/Profile/ProfileImageEditor';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-evenly',
    alignItems: 'center',
    height: 500,
    marginTop: '2rem',
  },
  profileImg: {
    height: 200,
    width: 200,
    color: 'black',
    borderRadius: '50%',
    borderStyle: 'solid',
  },
  profileImgText: {
    position: 'absolute',
    zIndex: 3,
    top: '30%',
    color: 'black',
  },
  nameField: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
});
/**
 * Page used to edit a profile
 * @param {*} props
 */
function ProfileEditPage(props) {
  const { token } = props;
  const classes = useStyles();
  const [loaded, setLoaded] = React.useState(false);
  const [showProfileImgModal, setShowProfileImgModal] = React.useState(false);
  const [imageData, setImageData] = React.useState('#');
  const [mediaError, setMediaError] = React.useState(false);
  const [user, setUser] = React.useState({});
  const [name, setName] = React.useState();
  const [errorMsg, setErrorMsg] = React.useState('');
  const handleErrorClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setErrorMsg('');
  };
  const history = useHistory();
  // Fetches user data
  const uploadUser = async (tokenID) => {
    try {
      const result = await getUser(tokenID);
      setUser(result.user);
      if (result.user.profileImg !== undefined) {
        setImageData(result.user.profileImg);
      }
      setLoaded(true);
    } catch (e) {
      setLoaded(true);
      setErrorMsg('Could not find user at this moment. Please try again');
    }
  };
  // Changes the image shown given image data
  const changeImageData = (data) => {
    setImageData(data);
    setShowProfileImgModal(false);
  };
  // Sends backend request to save changes made
  const handleSaveChangesClick = async () => {
    const updates = { name };
    if (imageData !== '#') {
      updates.profileImg = imageData;
    }
    await updateUser(token, updates);
    history.push('/profile');
  };
  const uploadProfileImage = async () => {
    setShowProfileImgModal(false);
  };
  const handleNameChange = (e) => {
    setName(e.target.value);
  };
  React.useEffect(() => {
    uploadUser(token);
  }, [token, user.name, user.profileImg]);
  return (
    <Container className={classes.root}>
      <GlobalError open={errorMsg !== ''} handleClose={handleErrorClose} />
      <Dialog
        open={showProfileImgModal}
        onClose={() => setShowProfileImgModal(false)}
        PaperProps={{
          style: {
            backgroundColor: 'white',
          },
        }}
      >
        <DialogActions>
          <IconButton
            onClick={() => setShowProfileImgModal(false)}
            aria-label="close window"
          >
            <CloseIcon />
          </IconButton>
        </DialogActions>
        <DialogContent>
          <ProfileImageEditor
            imageData={imageData}
            setImageData={changeImageData}
            setError={setMediaError}
            error={mediaError}
            uploadImage={uploadProfileImage}
          />
        </DialogContent>
      </Dialog>
      {
        loaded ? (
          <>
            <IconButton
              className={classes.profileImg}
              onClick={() => setShowProfileImgModal(true)}
              aria-label="Profile Image Click Here To Change Image"
            >
              {
                (imageData === '#' ? (
                  <FaceIcon className={classes.profileImg} />
                ) : <img className={classes.profileImg} src={imageData} alt="profile" />)
              }
            </IconButton>
            <Button aria-label="Change Profile Image" color="primary" onClick={() => setShowProfileImgModal(true)}>
              Change Profile Image
            </Button>
            <TextField
              defaultValue={user.name}
              value={name}
              label="Name"
              className={classes.nameField}
              variant="outlined"
              onChange={handleNameChange}
              inputProps={{ 'aria-label': 'Change Name' }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSaveChangesClick}
              aria-label="Save Changes"
            >
              Save Changes
            </Button>
          </>
        )
          : (<CircularProgress />)
      }
    </Container>
  );
}

ProfileEditPage.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ProfileEditPage;
