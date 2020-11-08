import { Container, List, ListItem } from '@material-ui/core';
import PropTypes from 'prop-types';
import React from 'react';

function EditGame(props) {
  const [questions, setQuestions] = React.useState([]);
  const { id } = props;
  React.useEffect(() => {
    console.log(id);
    setQuestions([]);
  }, [id]);

  return (
    <Container>
      <h1>Edit Game</h1>
      <List component="nav">
        {(questions.length > 0)
          && questions.map((q) => (
            <ListItem
              button
            >
              {q.name}
            </ListItem>
          ))}
      </List>
    </Container>
  );
}

EditGame.propTypes = {
  id: PropTypes.number.isRequired,
};

export default EditGame;
