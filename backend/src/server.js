const fs = require('fs');
const express = require("express");
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const cors = require('cors');

const swaggerDocument = require('../../swagger.json');

const app = express();

app.use(cors())
app.use(bodyParser.urlencoded({extended:true}));
app.use(bodyParser.json())
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.post('/admin/auth/login', (req, res) => {
  const { email, password } = req.body;
  return res.status(200).send({});
});

app.post('/admin/auth/logout', (req, res) => {
  const { token } = req.header;
  return res.status(200).send({});
});

app.post('/admin/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  return res.status(200).send({});
});

app.get('/admin/game', (req, res) => {
  const { token } = req.header;
  return res.status(200).send({});
});

app.get('/admin/game/:gameid', (req, res) => {
  const { token } = req.header;
  const { gameid } = req.params;
  return res.status(200).send({});
});

app.put('/admin/game/:gameid', (req, res) => {
  const { token } = req.header;
  const { gameid } = req.params;
  const { payload } = req.body;
  return res.status(200).send({});
});

app.post('/admin/game/new', (req, res) => {
  const { token } = req.header;
  const { name } = req.body;
  return res.status(200).send({});
});

app.post('/admin/game/:gameid/start', (req, res) => {
  const { token } = req.header;
  const { gameid } = req.params;
  return res.status(200).send({});
});

app.post('/admin/game/:gameid/end', (req, res) => {
  const { token } = req.header;
  const { gameid } = req.params;
  return res.status(200).send({});
});

app.get('/admin/results/:sessionid', (req, res) => {
  const { token } = req.header;
  const { sessionid } = req.params;
  return res.status(200).send({});
});

app.post('/play/join/:sessionid', (req, res) => {
  const { sessionid } = req.params;
  return res.status(200).send({});
});

app.get('/play/question/:playerid', (req, res) => {
  const { playerid } = req.params;
  return res.status(200).send({});
});

app.put('/play/answer/:playerid', (req, res) => {
  const { playerid } = req.params;
  const { question, payload } = req.body;
  return res.status(200).send({});
});

app.put('/play/results/:playerid', (req, res) => {
  const { playerid } = req.params;
  const { question, payload } = req.body;
  return res.status(200).send({});
});


const configData = JSON.parse(fs.readFileSync('./config.json'));
const port = 'BACKEND_PORT' in configData ? configData['BACKEND_PORT'] : 5000;

app.listen(port, () => {
  console.log(`Backend is now listening on port ${port}!`);
});
