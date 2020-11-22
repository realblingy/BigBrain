import React from 'react';
import {
  CircularProgress,
  Container, Link, makeStyles,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import FaceIcon from '@material-ui/icons/Face';
import { getUser } from '../api';

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
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
  editProfile: {
    marginTop: '1rem',
  },
});
/**
 * Page to show profile of a user
 * @param {*} props
 */
function ProfilePage(props) {
  const { token } = props;
  const classes = useStyles();
  const [loaded, setLoaded] = React.useState(false);
  const [user, setUser] = React.useState({});
  // Fetches user data
  const uploadUser = async (tokenID) => {
    try {
      const result = await getUser(tokenID);
      setUser(result.user);
      setLoaded(true);
    } catch (e) {
      setLoaded(true);
      console.log(e);
    }
  };
  React.useEffect(() => {
    uploadUser(token);
  }, [token]);
  return (
    <Container className={classes.root}>
      {
        loaded ? (
          <>
            { user.profileImg === undefined ? (
              <FaceIcon className={classes.profileImg} />
            ) : <img className={classes.profileImg} src={user.profileImg} alt="profile" />}
            {/* </IconButton> */}
            <h1>{`BigBrainID: ${user.id}`}</h1>
            <h2>{`Name: ${user.name}`}</h2>
            <h3>{`Games won: ${user.wins}`}</h3>
            <h4>{`Total hours played: ${user.totalHours}`}</h4>
            <Link href="/profile/edit" className={classes.editProfile}>
              Edit Profile
            </Link>
          </>
        )
          : (<CircularProgress />)
      }
    </Container>
  );
}

ProfilePage.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ProfilePage;
