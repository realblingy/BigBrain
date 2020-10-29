import fs from 'fs';
import express from "express";
import swaggerUi from 'swagger-ui-express';
import bodyParser from 'body-parser';
import cors from 'cors';

import { InputError } from './error';
import swaggerDocument from '../../swagger.json';
import {
  getEmailFromAuthorization,
  login,
  logout,
  register,
  save,
  getQuizzesFromAdmin,
  addQuiz,
  assertOwnsQuiz,
  getQuiz,
  updateQuiz,
} from './service';

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json());

const catchErrors = fn => async (req, res) => {
  try {
    await fn(req, res);
    save();
  } catch (err) {
    if (err instanceof InputError) {
      res.status(400).send({ error: err.message });
    } else {
      console.log(err);
      res.status(500).send({ error: 'A system error ocurred' });
    }
  }
};

/***************************************************************
                       Auth Functions
***************************************************************/

const authed = fn => (req, res) => {
  const email = getEmailFromAuthorization(req.header('Authorization'));
  fn(req, res, email);
}

app.post('/admin/auth/login', catchErrors(async (req, res) => {
  const { email, password } = req.body;
  const token = await login(email, password);
  return res.json({ token, });
}));

app.post('/admin/auth/register', catchErrors(async (req, res) => {
  const { email, password, name } = req.body;
  const token = await register(email, password, name); 
  return res.json({ token, });
}));

app.post('/admin/auth/logout', catchErrors(authed(async (req, res, email) => {
  await logout(email);
  return res.json({});
})));


/***************************************************************
                       Quiz Functions
***************************************************************/

app.get('/admin/quiz', catchErrors(authed(async (req, res, email) => {
  return res.json({ quizzes: await getQuizzesFromAdmin(email), });
})));

app.post('/admin/quiz/new', catchErrors(authed(async (req, res, email) => {
  return res.json({ quizId: await addQuiz(req.body.name, email) });
})));

app.get('/admin/quiz/:quizid', catchErrors(authed(async (req, res, email) => {
  const { quizid } = req.params;
  const { payload } = req.body;
  await assertOwnsQuiz(email, quizid);
  return res.json(await getQuiz(quizid));
})));

app.put('/admin/quiz/:quizid', catchErrors(authed(async (req, res, email) => {
  const { quizid } = req.params;
  const { questions } = req.body;
  await assertOwnsQuiz(email, quizid);
  await updateQuiz(quizid, questions);
  return res.status(200).send({});
})));

// INCOMPLETE
app.post('/admin/quiz/:quizid/start', (req, res) => {
  return res.status(200).json({});
});

// INCOMPLETE
app.post('/admin/quiz/:quizid/end', (req, res) => {
  const { token } = req.header;
  const { quizid } = req.params;
  return res.status(200).send({});
});

// INCOMPLETE
app.get('/admin/results/:sessionid', (req, res) => {
  const { token } = req.header;
  const { sessionid } = req.params;
  return res.status(200).send({});
});

/***************************************************************
                       Play Functions
***************************************************************/

// INCOMPLETE
app.post('/play/join/:sessionid', (req, res) => {
  const { sessionid } = req.params;
  return res.status(200).send({});
});

// INCOMPLETE
app.get('/play/question/:playerid', (req, res) => {
  const { playerid } = req.params;
  return res.status(200).send({});
});

// INCOMPLETE
app.put('/play/answer/:playerid', (req, res) => {
  const { playerid } = req.params;
  const { question, payload } = req.body;
  return res.status(200).send({});
});

// INCOMPLETE
app.put('/play/results/:playerid', (req, res) => {
  const { playerid } = req.params;
  const { question, payload } = req.body;
  return res.status(200).send({});
});


/***************************************************************
                       Running Server
***************************************************************/

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

const configData = JSON.parse(fs.readFileSync('./frontend/config.json'));
const port = 'BACKEND_PORT' in configData ? configData['BACKEND_PORT'] : 5000;
app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
});
