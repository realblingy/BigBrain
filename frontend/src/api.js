import config from './config.json';

// Port address
const port = `http://localhost:${config.BACKEND_PORT}`;
export default port;

export const logOut = async (token) => {
  const response = await fetch(`${port}/admin/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  const responseData = await response.json();
  if (response.status === 200) {
    return responseData;
  }
  throw new Error('Could not logout user');
};

export const getUser = async (token) => {
  const response = await fetch(`${port}/admin/auth/profile`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not load user at the moment');
};

export const getQuizData = async (quizid, token) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error(`Could not load quiz: ${quizid}`);
};

export const getQuizzes = async (token) => {
  const response = await fetch(`${port}/admin/quiz`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });

  if (response.status === 200) {
    const responseData = await response.json();
    const responseQuizzes = await responseData.quizzes.map(async (quiz) => {
      const { id } = quiz;
      const newQuiz = await getQuizData(id, token);
      newQuiz.id = id;
      return newQuiz;
    });
    return Promise.all(responseQuizzes);
  }
  throw new Error('Could not load quizzes.');
};

export const postNewQuiz = async (token, name) => {
  const response = await fetch(`${port}/admin/quiz/new`, {
    method: 'POST',
    body: JSON.stringify({
      name,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not post new quiz');
};

export const updateQuiz = async (token, questions, quizid) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}`, {
    method: 'PUT',
    body: JSON.stringify({
      questions,
    }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return (Object.keys(responseData).length === 0 && responseData.constructor === Object);
  }
  throw new Error('Could not update quiz');
};

export const uploadQuiz = async (token, quiz) => {
  const response = await fetch(`${port}/admin/quiz/new`, {
    method: 'POST',
    body: JSON.stringify({ name: quiz.name }),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    response.json()
      .then((data) => {
        updateQuiz(token, quiz.questions, data.quizId);
      })
      .catch((e) => {
        throw new Error(e);
      });
  }
};

export const startGamePost = async (token, quizid) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}/start`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  return response;
  // throw new Error('Could not start quiz');
};

export const endGamePost = async (token, quizid) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}/end`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not end quiz');
};

export const getSessionResults = async (token, sessionid) => {
  const response = await fetch(`${port}/admin/session/${sessionid}/results`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not get results');
};

export const joinGame = async (name, sessionid) => {
  const response = await fetch(`${port}/play/join/${sessionid}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      name,
    }),
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not join game');
};

export const getPlayerStatus = async (playerID) => {
  const response = await fetch(`${port}/play/${playerID}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not get player status');
};

export const getPlayerQuestion = async (playerID) => {
  const response = await fetch(`${port}/play/${playerID}/question`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Waiting for host to start session');
};

export const advanceQuizPost = async (token, quizid) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}/advance`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not advance quiz to the next section');
};

export const getSessionStatus = async (token, sessionid) => {
  const response = await fetch(`${port}/admin/session/${sessionid}/status`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  throw new Error('Could not get session status');
};

export const deleteQuiz = async (token, quizid) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return (Object.keys(responseData).length === 0 && responseData.constructor === Object);
  }
  return new Error('Quiz could not be deleted at this time.');
};
