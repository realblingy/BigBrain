import React from 'react';
import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from 'react-router-dom';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Register from './pages/Register';

const theme = createMuiTheme({
  typography: {
    h2: {
      fontSize: '3rem',
    },
  },
  palette: {
    primary: {
      main: '#fefb92',
    },
    error: {
      main: '#FF0000',
    },
  },
});

function App() {
  const storedToken = localStorage.getItem('token');
  const [token, setToken] = React.useState(storedToken !== null ? storedToken : '');

  React.useEffect(() => {
    localStorage.setItem('token', token);
  }, [token]);

  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Switch>
          <Route exact path="/">
            <Login setToken={setToken} token={token} />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard setToken={setToken} token={token} />
          </Route>
          <Route exact path="/register">
            <Register setToken={setToken} />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
