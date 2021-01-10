'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const usersRouter = require('./users/usersRouter');
const authRouter = require('./auth/authRouter');
const profileRouter = require('./profile/profileRouter');
const friendsRouter = require('./friends/friendsRouter');
const historyRouter = require('./history/historyRouter');
const morganOption = NODE_ENV === 'production' ? 'tiny' : 'common';
const app = express();

app.use(morgan(morganOption));
app.use(helmet());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, world!');
});
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);
app.use('/api/profile', profileRouter); 
app.use('/api/friends', friendsRouter);
app.use('/api/history', historyRouter);


app.use(function errorHandler(error, req, res, next) {
  let response;
  if (process.env.NODE_ENV === 'production') {
    response = { error: { message: 'server error' } };
  } else {
    console.log(error);
    response = { message: error.messager, error };
  }
  res.status(500).json(response);
});
module.exports = app;
