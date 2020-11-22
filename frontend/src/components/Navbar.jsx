import React, { useContext } from 'react';
import {
  AppBar, Toolbar, Typography, IconButton, makeStyles, Menu, MenuItem,
} from '@material-ui/core';
// import MenuIcon from '@material-ui/icons/Menu';
// import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import TokenContext from '../TokenContext';
import { logOut } from '../api';
// import LogoutButton from './LogoutButton';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#212032',
    color: 'white',
    flexGrow: 1,
    zIndex: 5,
  },
  title: {
    flexGrow: 1,
    cursor: 'pointer',
  },
});

function Navbar() {
  const { token, setToken } = useContext(TokenContext);
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const isMenuOpen = Boolean(anchorEl);
  const history = useHistory();

  const goToDashboard = () => {
    history.push('/dashboard');
  };

  const handleProfileMenuOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleProfileClick = () => {
    history.push('/profile/');
    handleMenuClose();
  };

  const handleLogoutClick = () => {
    handleMenuClose();
    logOut(token)
      .then(() => {
        setToken('');
        history.push('/');
        window.localStorage.removeItem('token');
      });
  };

  return (
    <AppBar className={classes.root} position="static">
      <Toolbar>
        <Typography button name="homeButton" onClick={goToDashboard} variant="h6" className={classes.title}>
          BigBrain Dashboard
        </Typography>
        <IconButton
          edge="end"
          aria-label="account of current user"
          aria-haspopup="true"
          onClick={handleProfileMenuOpen}
          name="accountIcon"
        >
          <AccountCircleIcon style={{ color: 'white' }} />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
          keepMounted
          transformOrigin={{ vertical: 'top', horizontal: 'right' }}
          open={isMenuOpen}
          onClose={handleMenuClose}
          PaperProps={{
            style: {
              backgroundColor: 'white',
            },
          }}
        >
          <MenuItem name="profile" aria-label="Profile" onClick={handleProfileClick}>Profile</MenuItem>
          <MenuItem name="logout" aria-label="Logout" onClick={handleLogoutClick}>Logout</MenuItem>
        </Menu>
      </Toolbar>
    </AppBar>
  );
}

export default Navbar;
