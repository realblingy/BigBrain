import fs from 'fs';
import jwt from 'jsonwebtoken';
import AsyncLock from 'async-lock';
import { InputError } from './error';


const lock = new AsyncLock();

const JWT_SECRET = 'llamallamaduck';
const DATABASE_FILE = './database.json';

/***************************************************************
                       State Management
***************************************************************/

let admins = {};
let quizzes = {};
let sessions = {};

export const save = () => 
  new Promise((resolve, reject) => {
    lock.acquire(`saveData`, () => {
      try {
        fs.writeFileSync(DATABASE_FILE, JSON.stringify({
          admins,
          quizzes,
          sessions,
        }));
        resolve();
      } catch {
        reject();
      }
    });
  });

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

const newSessionId = _ => generateId(Object.keys(sessions));
const newQuizId = _ => generateId(Object.keys(quizzes));

export const userLock = callback => new Promise((resolve, reject) => {
  lock.acquire(`userAuthLock`, callback(resolve, reject));
});

export const quizLock = callback => new Promise((resolve, reject) => {
  lock.acquire(`quizMutateLock`, callback(resolve, reject));
});

const randNum = () => Math.round(Math.random() * (9999999999 - 999999999) + 999999999);
const generateId = currentList => {
  let R = randNum();
  while (R in currentList) {
    R = randNum();
  }
  return R.toString();
};

/***************************************************************
                       Auth Functions
***************************************************************/

export const getEmailFromAuthorization = authorization => {
  try {
    const token = authorization.replace('Bearer ', '');
    const { email } = jwt.verify(token, JWT_SECRET);
    if (!(email in admins)) {
      throw new InputError('Invalid Token');
    }
    return email;
  } catch {
    throw new InputError('Invalid token');
  }
};

export const login = (email, password) => userLock((resolve, reject) => {
  if (email in admins) {
    if (admins[email].password === password) {
      admins[email].sessionActive = true;
      resolve(jwt.sign({ email, }, JWT_SECRET, { algorithm: 'HS256'}));
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
  const token = jwt.sign({ email, }, JWT_SECRET, { algorithm: 'HS256'});
  resolve(token);
});

/***************************************************************
                       Quiz Functions
***************************************************************/

const quizExistsAssert = quizId => {
  if (!(quizId in quizzes)) {
    throw new Error(`Quiz ID ${uizId} does not exist`);
  }
};

const newQuizPayload = (name, owner) => ({
  name,
  owner,
  questions: [],
  started: false,
  createdAt: new Date(),
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
    started: quizzes[key].started,
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