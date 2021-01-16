'use strict';

const express = require('express');

const UsersService = require('./usersService');

const usersRouter = express.Router();
const jsonBodyParser = express.json();

//adds a new user 
usersRouter.post('/', jsonBodyParser, (req, res, next) => {
  const { password, username, email } = req.body;

  for (const field of ['username', 'password', 'email']) {
    if (!req.body[field]) {
      return res
        .status(400)
        .json({ error: `Missing ${field} in request body` });
    }
  }
  if (password.length < 6) {
    return res
      .status(400)
      .json({ error: `Password must be at least 6 characters` });
  }
  if (password.length > 72) {
    return res
      .status(400)
      .json({ error: `Password must be less than 72 characters` });
  }
  UsersService.hasUserWithUsername(req.app.get('db'), username)
    .then((hasUserWithUsername) => {
      if (hasUserWithUsername)
        return res.status(400).json({ error: `Username Taken` });

      return UsersService.hashPassword(password).then(
        //need to build
        (hashedPassword) => {
          const newUser = {
            username,
            password: hashedPassword,
            email,
          };
          return UsersService.insertUser(
            //need to build
            req.app.get('db'),
            newUser
          ).then((user) => {
            res.status(201).json(UsersService.serializeUser(user));
          });
        }
      );
    })
    .catch(next);
});

module.exports = usersRouter;
