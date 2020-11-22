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
import TokenContext from './TokenContext';
import Results from './pages/Results';
import Play from './pages/Play';
import Game from './pages/Game';
import PlayerResults from './pages/PlayerResults';
import EditQuestion from './pages/EditQuestion';
import ProfilePage from './pages/ProfilePage';
import ProfileEditPage from './pages/ProfileEditPage';

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
        <TokenContext.Provider value={{ token, setToken }}>
          {token && <Navbar setToken={setToken} token={token} />}
          <Switch>
            <Route exact path="/">
              <Login setToken={setToken} token={token} />
            </Route>
            <Route exact path="/dashboard">
              <Dashboard setToken={setToken} token={token} />
            </Route>
            <Route exact path="/game/:quizID/:sessionID/:playerID">
              <Game />
            </Route>
            <Route exact path="/register">
              <Register setToken={setToken} token={token} />
            </Route>
            <Route exact path="/results/:id">
              <Results />
            </Route>
            <Route exact path={['/play', '/play/:quizID/:id']}>
              <Play />
            </Route>
            <Route exact path="/playerResults/:quizID/:playerID">
              <PlayerResults />
            </Route>
            <Route
              exact
              path="/edit/:id"
              render={(props) => {
                const { match } = props;
                return (<EditGame token={token} id={Number(match.params.id)} />);
              }}
            />
            <Route
              exact
              path="/edit/:id/:questionid"
              render={(props) => {
                const { match } = props;
                return (
                  <EditQuestion
                    token={token}
                    id={Number(match.params.id)}
                    questionid={Number(match.params.questionid)}
                  />
                );
              }}
            />
            <Route
              exact
              path="/profile/"
              render={() => (<ProfilePage token={token} />)}
            />
            <Route
              exact
              path="/profile/edit"
              render={() => (<ProfileEditPage token={token} />)}
            />
          </Switch>
        </TokenContext.Provider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
