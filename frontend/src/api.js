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
