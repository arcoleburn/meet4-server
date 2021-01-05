'use strict';

require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const helmet = require('helmet');
const { NODE_ENV } = require('./config');

const usersRouter = require('./users/usersRouter');
const authRouter = require('./auth/authRouter');

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
// app.use('/api/profile', profileRouter)//need to build. should contain: 


// a get user info endpt 
//a get locations endpoint? 
//a post new locations endpoint 
//a post restaurants endpoint 
//a get fav restaurants endpoint? 

// app.use('/api/friends', friendsRouter) //need to build should have:
//a get friends endpt 
//a make friend request endpt 
//an accept friend endpoint? 
//a del friend endpt 



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
