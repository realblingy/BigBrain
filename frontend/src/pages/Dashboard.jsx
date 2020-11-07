import React from 'react';
import PropTypes from 'prop-types';
import { Redirect } from 'react-router-dom';
import { CircularProgress } from '@material-ui/core';
import Logout from '../components/LogoutButton';
import Navbar from '../components/Navbar';
import port from '../api';

function Dashboard(props) {
  const { setToken, token } = props;
  const [quizzes, setQuizzes] = React.useState([]);
  const [loading, setLoading] = React.useState(false);

  if (token === '') {
    return <Redirect to="/" />;
  }

  const getQuizzes = async () => {
    const response = await fetch(`${port}/admin/quiz`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    if (response.status === 200) {
      const responseData = await response.json();
      return responseData.quizzes;
    }
    throw new Error('Could not load quizzes.');
  };

  React.useEffect(async () => {
    try {
      setLoading(true);
      const data = await getQuizzes();
      setQuizzes(JSON.stringify(data));
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }, []);

  return (
    <div>
      <Navbar />
      {loading ? <CircularProgress color="primary" /> : <h1>{quizzes}</h1>}
      <Logout setToken={setToken} token={token} />
    </div>
  );
}

Dashboard.propTypes = {
  setToken: PropTypes.func.isRequired,
  token: PropTypes.string.isRequired,
};
export default Dashboard;
