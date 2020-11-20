import React from 'react';
import PropTypes from 'prop-types';
import { getUser } from '../api';

function ProfilePage(props) {
  const { token } = props;

  React.useEffect(() => {
    getUser(token)
      .then((user) => {
        console.log(user);
      })
      .catch((e) => {
        console.log(e);
      });
  });

  return (
    <div>
      profile
      HOW ARE YOU?
    </div>
  );
}

ProfilePage.propTypes = {
  token: PropTypes.string.isRequired,
};

export default ProfilePage;
