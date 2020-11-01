import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError, AccessError, } from './error';

import {
  quizQuestionPublicReturn,
  quizQuestionGetAnswer,
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
let players = {};

const update = (admins, quizzes, sessions) =>
  new Promise((resolve, reject) => {
    lock.acquire('saveData', () => {
      try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({
          admins,
          quizzes,
          sessions,
          players,
        }));
        resolve();
      } catch {
        reject(new Error('Writing to database failed'));
      }
    });
  });

export const save = () => update(admins, quizzes, sessions, players);
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
  players = data.players;
} catch {
  console.log('WARNING: No database found, create a new one');
  save();
}

/***************************************************************
                       Helper Functions
***************************************************************/

const newSessionId = _ => generateId(Object.keys(sessions), 999999);
const newQuizId = _ => generateId(Object.keys(quizzes));
const newPlayerId = _ => generateId(Object.keys(players));

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
  while (R in currentList) {
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
  active: false,
  createdAt: new Date().toISOString(),
});

export const assertOwnsQuiz = (email, quizId) => quizLock((resolve, reject) => {
  resolve(quizzes[quizId].owner === email);
});

export const getQuizzesFromAdmin = email => quizLock((resolve, reject) => {
  resolve(Object.keys(quizzes).filter(key => quizzes[key].owner === email).map(key => ({
    id: key,
    createdAt: quizzes[key].createdAt,
    name: quizzes[key].name,
    owner: quizzes[key].owner,
    active: Object.keys(sessions).filter(s => s.quizId === key && s.active).length > 0,
  })));
});

export const addQuiz = (name, email) => quizLock((resolve, reject) => {
  const newId = newQuizId();
  quizzes[newId] = newQuizPayload(name, email);
  resolve(newId);
});

export const getQuiz = quizId => quizLock((resolve, reject) => {
  resolve(quizzes[quizId]);
});

export const updateQuiz = (quizId, questions) => quizLock((resolve, reject) => {
  quizzes[quizId].questions = questions;
  resolve();
});

export const removeQuiz = quizId => quizLock((resolve, reject) => {
  delete quizzes[quizId];
  resolve();
});

export const startQuiz = quizId => quizLock((resolve, reject) => {
  if (quizHasSession()) {
    throw new InputError('Quiz already has active session');
  }
  const id = newSessionId();
  sessions[id] = newSessionPayload(quizId);
  resolve(id);
});

export const advanceQuiz = quizId => quizLock((resolve, reject) => {
  const session = getActiveSession(quizId);
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
  }, questionDuration * 1000);
  resolve(session.position);
});

export const endQuiz = quizId => quizLock((resolve, reject) => {
  const session = getActiveSession(quizId);
  session.active = false;
  resolve();
});

/***************************************************************
                       Session Functions
***************************************************************/

const quizHasSession = quizId => Object.keys(sessions).filter(s => s.quizId === quizId).length === 1;

const getActiveSession = quizId => {
  if (!quizHasSession(quizId)) {
    throw new InputError('Quiz has no active session');
  }
  return sessions[Object.keys(sessions).filter(s => s.quizId === quizId)[0]];
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
    throw new InputError('Cannot get results for active session');
  }
  resolve(Object.keys(session.players).map(player => session.players[player]));
});

export const playerJoin = (name, sessionId) => sessionLock((resolve, reject) => {
  const session = getActiveSession(sessionId);
  if (session.position > 0) {
    throw new InputError('Session has already begun');
  }
  const id = newPlayerId();
  session.players[id] = newPlayerPayload(name);
});

export const getQuestion = playerId => sessionLock((resolve, reject) => {
  const session = getActiveSession(sessionIdFromPlayerId(playerId));
  return quizQuestionPublicReturn(session.questions[session.position]);
});

export const getAnswer = playerId => sessionLock((resolve, reject) => {
  const session = getActiveSession(sessionIdFromPlayerId(playerId));
  if (!session.answerAvailable) {
    throw new InputError('Question time has not been completed');
  }
  return quizQuestionGetAnswer(session.questions[session.position]);
});

export const submitAnswer = (playerId, answerId) => sessionLock((resolve, reject) => {
  const session = getActiveSession(sessionIdFromPlayerId(playerId));
  session.players[playerId][session.position] = {
    answer: answerId,
    correct: quizQuestionGetAnswer(session.questions[session.position]) === answerId,
    answeredAt: new Date().toISOString(),
  };
});

export const getResults = playerId => sessionLock((resolve, reject) => {
  const session = sessions[sessionIdFromPlayerId(playerId)];
  return session.players[playerId];
});
