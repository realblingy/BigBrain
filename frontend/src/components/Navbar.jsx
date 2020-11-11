import React from 'react';
import {
  AppBar, Toolbar, Typography, Button, IconButton, makeStyles,
} from '@material-ui/core';
import MenuIcon from '@material-ui/icons/Menu';
import PropTypes from 'prop-types';
import LogoutButton from './LogoutButton';

const useStyles = makeStyles({
  root: {
    backgroundColor: '#212032',
    color: 'white',
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
});

function Navbar(props) {
  const { setToken, token } = props;
  const classes = useStyles();
  return (
    <AppBar className={classes.root} position="static">
      <Toolbar>
        <IconButton className={classes.menuButton} edge="start" color="inherit" aria-label="menu">
          <MenuIcon />
        </IconButton>
        <Typography variant="h6" className={classes.title}>
          Dashboard
        </Typography>
        <Button color="inherit">Login</Button>
        <LogoutButton setToken={setToken} token={token} />
      </Toolbar>
    </AppBar>
  );
}

Navbar.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};

export default Navbar;
