import React, { useContext } from 'react';
import { useParams } from 'react-router-dom';
import { getSessionResults } from '../api';
import TokenContext from '../TokenContext';

function Results() {
  const { id } = useParams();
  const { token } = useContext(TokenContext);
  React.useEffect(() => {
    getSessionResults(token, id).then((r) => console.log(r));
  });
  return (
    <div>
      results
      {id}
    </div>
  );
}

export default Results;
