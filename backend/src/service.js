import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AccessError, } from './error';

import {
  quizQuestionPublicReturn,
  quizQuestionGetAnswers,
  quizQuestionGetCorrectAnswers,
  quizQuestionGetDuration,
} from './custom';

const lock = new AsyncLock();

const JWT_SECRET = 'llamallamaduck';
const DATABASE_FILE = './database.json';

/***************************************************************
                       State Management
***************************************************************/

let admins = {};
let quizzes = {};
let sessions = {};

const update = (admins, quizzes, sessions) =>
  new Promise((resolve, reject) => {
    lock.acquire('saveData', () => {
      try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({
          admins,
          quizzes,
          sessions,
        }));
        resolve();
      } catch {
        reject(new Error('Writing to database failed'));
      }
    });
  });

export const save = () => update(admins, quizzes, sessions);
export const reset = () => {
  update({}, {}, {});
  admins = {};
  quizzes = {};
  sessions = {};
};

try {
  const data = JSON.parse(fs.readFileSync(DATABASE_FILE));
  admins = data.admins;
  quizzes = data.quizzes;
  sessions = data.sessions;
} catch {
  console.log('WARNING: No database found, create a new one');
  save();
}

/***************************************************************
                       Helper Functions
***************************************************************/

const newSessionId = _ => generateId(Object.keys(sessions), 999999);
const newQuizId = _ => generateId(Object.keys(quizzes));
const newPlayerId = _ => generateId(Object.keys(sessions).map(s => Object.keys(sessions[s].players)));

export const userLock = callback => new Promise((resolve, reject) => {
  lock.acquire('userAuthLock', callback(resolve, reject));
});

export const quizLock = callback => new Promise((resolve, reject) => {
  lock.acquire('quizMutateLock', callback(resolve, reject));
});

export const sessionLock = callback => new Promise((resolve, reject) => {
  lock.acquire('sessionMutateLock', callback(resolve, reject));
});

const copy = x => JSON.parse(JSON.stringify(x));
const randNum = max => Math.round(Math.random() * (max - Math.floor(max / 10)) + Math.floor(max / 10));
const generateId = (currentList, max = 999999999) => {
  let R = randNum(max);
  while (currentList.includes(R)) {
    R = randNum(max);
  }
  return R.toString();
};

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = authorization => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email, } = jwt.verify(token, JWT_SECRET);
    if (!(email in admins)) {
      throw new AccessError('Invalid Token');
    }
    return email;
  } catch {
    throw new AccessError('Invalid token');
  }
};

export const login = (email, password) => userLock((resolve, reject) => {
  if (email in admins) {
    if (admins[email].password === password) {
      admins[email].sessionActive = true;
      resolve(jwt.sign({ email, }, JWT_SECRET, { algorithm: 'HS256', }));
    }
  }
  reject(new InputError('Invalid username or password'));
});

export const logout = (email) => userLock((resolve, reject) => {
  admins[email].sessionActive = false;
  resolve();
});

export const register = (email, password, name) => userLock((resolve, reject) => {
  if (email in admins) {
    reject(new InputError('Email address already registered'));
  }
  admins[email] = {
    name,
    password,
    sessionActive: true,
  };
  const token = jwt.sign({ email, }, JWT_SECRET, { algorithm: 'HS256', });
  resolve(token);
});

/***************************************************************
                       Quiz Functions
***************************************************************/

const newQuizPayload = (name, owner) => ({
  name,
  owner,
  questions: [],
  thumbnail: null,
  active: null,
  createdAt: new Date().toISOString(),
});

export const assertOwnsQuiz = (email, quizId) => quizLock((resolve, reject) => {
  if (!(quizId in quizzes)) {
    reject(new InputError('Invalid quiz ID'));
  }
  if (quizzes[quizId].owner !== email) {
    reject(new InputError('Admin does not own this Quiz'));
  }
  resolve();
});

export const getQuizzesFromAdmin = email => quizLock((resolve, reject) => {
  resolve(Object.keys(quizzes).filter(key => quizzes[key].owner === email).map(key => ({
    id: key,
    createdAt: quizzes[key].createdAt,
    name: quizzes[key].name,
    thumbnail: quizzes[key].thumbnail,
    owner: quizzes[key].owner,
    active: getActiveSessionIdFromQuizId(key),
  })));
});

export const addQuiz = (name, email) => quizLock((resolve, reject) => {
  const newId = newQuizId();
  quizzes[newId] = newQuizPayload(name, email);
  resolve(newId);
});

export const getQuiz = quizId => quizLock((resolve, reject) => {
  resolve({
    ...quizzes[quizId],
    active: getActiveSessionIdFromQuizId(quizId),
  });
});

export const updateQuiz = (quizId, questions, name, thumbnail) => quizLock((resolve, reject) => {
  if (questions) { quizzes[quizId].questions = questions; }
  if (name) { quizzes[quizId].name = name; }
  if (thumbnail) { quizzes[quizId].thumbnail = thumbnail; }
  resolve();
});

export const removeQuiz = quizId => quizLock((resolve, reject) => {
  delete quizzes[quizId];
  resolve();
});

export const startQuiz = quizId => quizLock((resolve, reject) => {
  if (quizHasActiveSession()) {
    throw new InputError('Quiz already has active session');
  }
  const id = newSessionId();
  sessions[id] = newSessionPayload(quizId);
  resolve(id);
});

export const advanceQuiz = quizId => quizLock((resolve, reject) => {
  const session = getActiveSessionFromQuizIdThrow(quizId);
  const totalQuestions = session.questions.length;
  session.position += 1;
  session.answerAvailable = false;
  if (session > totalQuestions) {
    endQuiz(quizId);
  }
  const questionDuration = quizQuestionGetDuration(session.questions[session.position]);
  clearTimeout(session.advanceTimeout);
  session.advanceTimeout = setTimeout(() => {
    session.answerAvailable = true;
  }, questionDuration);
  resolve(session.position);
});

export const endQuiz = quizId => quizLock((resolve, reject) => {
  const session = getActiveSessionFromQuizIdThrow(quizId);
  session.active = false;
  resolve();
});

/***************************************************************
                       Session Functions
***************************************************************/

const quizHasActiveSession = quizId => Object.keys(sessions).filter(s => sessions[s].quizId === quizId && sessions[s].active).length > 0;

const getActiveSessionFromQuizIdThrow = quizId => {
  if (!quizHasActiveSession(quizId)) {
    throw new InputError('Quiz has no active session');
  }
  const sessionId = getActiveSessionIdFromQuizId(quizId);
  if (sessionId !== null) {
    return sessions[sessionId];
  }
  return null;
};

const getActiveSessionIdFromQuizId = quizId => {
  const activeSessions = Object.keys(sessions).filter(s => sessions[s].quizId === quizId && sessions[s].active);
  if (activeSessions.length === 1) {
    return activeSessions[0];
  }
  return null;
};

const getActiveSessionFromSessionId = sessionId => {
  if (sessionId in sessions) {
    if (sessions[sessionId].active) {
      return sessions[sessionId];
    }
  }
  throw new InputError('Session ID is not an active session');
};

const sessionIdFromPlayerId = playerId => {
  for (const sessionId in Object.keys(sessions)) {
    if (Object.keys(sessions[sessionId].players).filter(p => p === playerId).length > 0) {
      return sessionId;
    }
  }
  throw new InputError('Player ID does not refer to valid player id');
};

const newSessionPayload = quizId => ({
  quizId,
  position: -1,
  players: {},
  questions: copy(quizzes[quizId].questions),
  active: true,
  answerAvailable: false,
  advanceTimeout: null,
});

const newPlayerPayload = (name, numQuestions) => ({
  name: name,
  answers: Array(numQuestions).fill(null),
});

export const sessionStatus = sessionId => {
  const session = sessions[sessionId];
  return {
    active: session.active,
    answerAvailable: session.answerAvailable,
    position: session.position,
    numQuestions: session.questions.length,
    players: Object.keys(session.players).map(player => session.players[player].name),
  };
};

export const assertOwnsSession = (email, sessionId) => {
  assertOwnsQuiz(email, sessions[sessionId].quizId);
};

export const sessionResults = sessionId => sessionLock((resolve, reject) => {
  const session = sessions[sessionId];
  if (session.active) {
    reject(new InputError('Cannot get results for active session'));
  }
  resolve(Object.keys(session.players).map(pid => session.players[pid]));
});

export const playerJoin = (name, sessionId) => sessionLock((resolve, reject) => {
  const session = getActiveSessionFromSessionId(sessionId);
  if (session.position > 0) {
    reject(new InputError('Session has already begun'));
  }
  const id = newPlayerId();
  session.players[id] = newPlayerPayload(name);
  resolve(id);
});

export const getQuestion = playerId => sessionLock((resolve, reject) => {
  const session = getActiveSessionFromSessionId(sessionIdFromPlayerId(playerId));
  resolve(quizQuestionPublicReturn(session.questions[session.position]));
});

export const getAnswers = playerId => sessionLock((resolve, reject) => {
  const session = getActiveSessionFromSessionId(sessionIdFromPlayerId(playerId));
  if (!session.answerAvailable) {
    reject(new InputError('Question time has not been completed'));
  }
  resolve(quizQuestionGetAnswers(session.questions[session.position]));
});

export const submitAnswer = (playerId, answerId) => sessionLock((resolve, reject) => {
  const session = getActiveSessionFromSessionId(sessionIdFromPlayerId(playerId));
  session.players[playerId].answers[session.position] = {
    answer: answerId,
    correct: quizQuestionGetCorrectAnswers(session.questions[session.position]).includes(answerId),
  };
  resolve();
});

export const getResults = playerId => sessionLock((resolve, reject) => {
  const session = sessions[sessionIdFromPlayerId(playerId)];
  resolve(session.players[playerId]);
});
