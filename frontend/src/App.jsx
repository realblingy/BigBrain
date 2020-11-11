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
import EditGame from './pages/EditGame';
import Navbar from './components/Navbar';

const theme = createMuiTheme({
  typography: {
    h2: {
      fontSize: '3rem',
    },
  },
  palette: {
    primary: {
      main: '#212032',
    },
    secondary: {
      main: '#E53026',
    },
    background: 'black',
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
        {token && <Navbar setToken={setToken} token={token} />}
        <Switch>
          <Route exact path="/">
            <Login setToken={setToken} token={token} />
          </Route>
          <Route exact path="/dashboard">
            <Dashboard setToken={setToken} token={token} />
          </Route>
          <Route exact path="/register">
            <Register setToken={setToken} token={token} />
          </Route>
          <Route
            exact
            path="/edit/:id"
            render={(props) => {
              const { match } = props;
              return (<EditGame token={token} id={Number(match.params.id)} />);
            }}
          />
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
