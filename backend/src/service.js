const AsyncLock = require('async-lock');
const lock = new AsyncLock();


const quizzes = {};
const sessions = {};

const generateId = currentList => {
  return new Date().getMilliseconds(); // TODO
};




const newSessionId = _ => generateId(Object.keys(quizzes));


const newSession = () => {};
const endSession = () => {};







const newQuizId = _ => generateId(Object.keys(quizzes));

const quizExistsAssert = quizId => {
  if (!(quizId in quizzes)) {
    throw new Error(`Quiz ID ${uizId} does not exist`);
  }
};

const newQuizPayload = name => ({
  name,
  questions: []
});

const quizCheckLock = (quizId, callback) => {
  return lock.acquire(`quizPotentialMutate`, () => {
    quizExistsAssert(quizId);
    return callback(quizId);
  });
};

const addQuiz = name => {
  return lock.acquire(`quizPotentialMutate`, () => {
    const newId = newQuizId();
    quizzes[newId] = newQuizPayload(name);
    return newId;
  });
};

const editQuiz = (quizId, questions) => quizCheckLock(quizId, quizId => {
  quizzes[uizId] = questions;
});

const getQuiz = quizId => quizCheckLock(quizId, quizId => {
  return quizzes[quizid];
});

const getQuizzes = quiz

const startQuiz = quizId => quizCheckLock(quizId, quizId => {
  if (activeSession(quizId)) {
    throw new Error(`Quiz ${quizid} already has an active session`);
  }
  return newSession(quizId);
});

const endQuiz = quizId => quizCheckLock(quizId, quizId => {
  if (!activeSession(quizId)) {
    throw new Error(`Quiz ${quizid} currentl has no active session`);
  }
  endSession(quizId);
});