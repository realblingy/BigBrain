import request from 'supertest';
import server from '../src/server';
import { reset } from '../src/service';

const THUMBNAIL = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==';

const postTry = async (path, status, payload, token) => sendTry('post', path, status, payload, token);
const getTry = async (path, status, payload, token) => sendTry('get', path, status, payload, token);
const deleteTry = async (path, status, payload, token) => sendTry('delete', path, status, payload, token);
const putTry = async (path, status, payload, token) => sendTry('put', path, status, payload, token);

const sendTry = async (typeFn, path, status = 200, payload = {}, token = null) => {
  let req = request(server);
  if (typeFn === 'post') {
    req = req.post(path);
  } else if (typeFn === 'get') {
    req = req.get(path);
  } else if (typeFn === 'delete') {
    req = req.delete(path);
  } else if (typeFn === 'put') {
    req = req.put(path);
  }
  if (token !== null) {
    req = req.set('Authorization', `Bearer ${token}`);
  }
  const response = await req.send(payload);
  expect(response.statusCode).toBe(status);
  return response.body;
};

const validToken = async () => {
  const { token } = await postTry('/admin/auth/login', 200, {
    email: 'hayden.smith@unsw.edu.au',
    password: 'bananapie',
  });
  return token;
}

const singleQuizId = async () => {
  const { quizzes } = await getTry('/admin/quiz', 200, {}, await validToken());
  const quizid = quizzes[0].id;
  return quizid;
};

describe('Test the root path', () => {

  beforeAll(() => {
    reset();
  });

  beforeAll(() => {
    server.close();
  });

  /***************************************************************
                       Auth Tests
  ***************************************************************/

  test('Registration of initial user', async () => {
    const body = await postTry('/admin/auth/register', 200, {
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
      name: 'Hayden',
    });
    expect(body.token instanceof String);
  });

  test('Inability to re-register a user', async () => {
    const body = await postTry('/admin/auth/register', 400, {
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
      name: 'Hayden',
    });
  });

  test('Login to an existing user', async () => {
    const body = await postTry('/admin/auth/login', 200, {
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapie',
    });
    expect(body.token instanceof String);
  });

  test('Login attempt with invalid credentials 1', async () => {
    const body = await postTry('/admin/auth/login', 400, {
      email: 'hayden.smith@unsw.edu.a',
      password: 'bananapie',
    });
  });

  test('Login attempt with invalid credentials 2', async () => {
    const body = await postTry('/admin/auth/login', 400, {
      email: 'hayden.smith@unsw.edu.au',
      password: 'bananapi',
    });
  });

  test('Logout a valid session', async () => {
    const bodyLogout = await postTry('/admin/auth/logout', 200, {}, await validToken());
    expect(bodyLogout).toMatchObject({});
  });

  test('Logout a session without auth token', async () => {
    const body = await postTry('/admin/auth/logout', 403, {});
    expect(body).toMatchObject({});
  });

  /***************************************************************
                       Quiz Tests
  ***************************************************************/
  test('Initially there are no quizzes', async () => {
    const body = await getTry('/admin/quiz', 200, {}, await validToken());
    expect(body.quizzes).toHaveLength(0);
  });

  test('Creating a single quiz, value missing', async () => {
    const body = await postTry('/admin/quiz/new', 400, {}, await validToken());
  });

  test('Creating a single quiz, token missing', async () => {
    const body = await postTry('/admin/quiz/new', 403, {
      name: 'QUIZ',
    });
  });

  test('Creating a single quiz', async () => {
    const body = await postTry('/admin/quiz/new', 200, {
      name: 'QUIZ',
    }, await validToken());
  });

  test('That there is now one quiz', async () => {
    const body = await getTry('/admin/quiz', 200, {}, await validToken());
    expect(body.quizzes).toHaveLength(1);
    expect(typeof body.quizzes[0].id).toBe('number');
    expect(typeof body.quizzes[0].createdAt).toBe('string');
    expect(body.quizzes[0].name).toBe('QUIZ');
    expect(body.quizzes[0].owner).toBe('hayden.smith@unsw.edu.au');
    expect(body.quizzes[0].active).toBe(null);
    expect(body.quizzes[0].thumbnail).toBe(null);
  });

  test('Create a second quiz', async () => {
    const body = await postTry('/admin/quiz/new', 200, {
      name: 'QUIZ2',
    }, await validToken());
  });

  test('That there is now two quizzes', async () => {
    const body = await getTry('/admin/quiz', 200, {}, await validToken());
    expect(body.quizzes).toHaveLength(2);
  });

  test('Try and delete a quiz with invalid token', async () => {
    const { quizzes } = await getTry('/admin/quiz', 200, {}, await validToken());
    const quizid = quizzes[1].id;
    const body = await deleteTry(`/admin/quiz/${quizid}`, 403, {});
  });

  test('Try and delete a quiz with invalid quizid', async () => {
    const body = await deleteTry(`/admin/quiz/${99999999999999}`, 400, {}, await validToken());
  });

  test('Try and delete a quiz', async () => {
    const { quizzes } = await getTry('/admin/quiz', 200, {}, await validToken());
    const quizid = quizzes[1].id;
    const body = await deleteTry(`/admin/quiz/${quizid}`, 200, {}, await validToken());
  });

  test('That there is now one quiz again', async () => {
    const body = await getTry('/admin/quiz', 200, {}, await validToken());
    expect(body.quizzes).toHaveLength(1);
  });

  test('Update quiz thumbnail and name', async () => {
    const { quizzes } = await getTry('/admin/quiz', 200, {}, await validToken());
    const quizid = quizzes[0].id;
    const body = await putTry(`/admin/quiz/${quizid}`, 200, {
      name: 'QUIZDIFF',
      thumbnail: THUMBNAIL,
    }, await validToken());
  });

  test('Check that thumbnail and name updated', async () => {
    const { quizzes } = await getTry('/admin/quiz', 200, {}, await validToken());
    const quiz = quizzes[0];
    expect(quiz.name).toBe('QUIZDIFF');
    expect(quiz.thumbnail).toBe(THUMBNAIL);
  });

  /***************************************************************
                       Admin Running a Session
  ***************************************************************/

  test('Can\'t start a session with invalid token', async () => {
    const body = await postTry('/admin/quiz/123/start', 403, {});
  });

  test('Can\'t advance a session with invalid token', async () => {
    const body = await postTry('/admin/quiz/123/advance', 403, {});
  });

  test('Can\'t end a session with invalid token', async () => {
    const body = await postTry('/admin/quiz/123/end', 403, {});
  });

  test('Can\'t get session status with invalid token', async () => {
    const body = await getTry('/admin/session/123/status', 403, {});
  });

  test('Can\'t get session results with invalid token', async () => {
    const body = await getTry('/admin/session/123/results', 403, {});
  });

  test('Ensure a session cant be ended when hasn\'t started', async () => {
    const quizid = await singleQuizId();
    await postTry(`/admin/quiz/${quizid}/end`, 400, {}, await validToken());
  });

  test('Ensure a session cant be advanced when hasn\'t started', async () => {
    const quizid = await singleQuizId();
    await postTry(`/admin/quiz/${quizid}/advance`, 400, {}, await validToken());
  });

  test('Can\'t start a quiz with invalid quizid', async () => {
    const body = await postTry('/admin/quiz/99999999999/start', 403, await validToken());
  });

  test('Ensure a quiz can be started', async () => {
    const quizid = await singleQuizId();
    await postTry(`/admin/quiz/${quizid}/start`, 200, {}, await validToken());
  });

  test('A session now exists for the quiz', async () => {
    const quizid = await singleQuizId();
    const body = await getTry(`/admin/quiz/${quizid}`, 200, {}, await validToken());
    expect(typeof body.active).toBe('number');
  });


  /***************************************************************
                       Auth Tests
  ***************************************************************/


});