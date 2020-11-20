import config from './config.json';

// Port address
const port = `http://localhost:${config.BACKEND_PORT}`;
export default port;

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

export const updateQuiz = async (token, name, questions, quizid) => {
  const response = await fetch(`${port}/admin/quiz/${quizid}`, {
    method: 'PUT',
    body: JSON.stringify({
      questions,
      name,
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
  console.log(JSON.stringify(quiz));
  const response = await fetch(`${port}/admin/quiz/new`, {
    method: 'POST',
    body: JSON.stringify(quiz),
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
  });
  if (response.status === 200) {
    const responseData = await response.json();
    return responseData;
  }
  console.log(response.status);
  throw new Error('Could not upload quiz');
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
  throw new Error('Could not start quiz');
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
  return new Error('Could not get results');
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
