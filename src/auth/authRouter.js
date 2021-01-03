'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwt-auth');
const AuthService = require('./authService');
const jsonBodyParser = express.json();
const authRouter = express.Router();

//logs user in
authRouter.post('/login', jsonBodyParser, (req, res, next) => {
  const { username, password } = req.body;
  const loginUser = { username, password };

  for (const [key, value] of Object.entries(loginUser))
    if (value == null) {
      return res
        .status(400)
        .json({ error: `Missing ${key} in request body` });
    }
  AuthService.getUserWithUserName(
    req.app.get('db'),
    loginUser.username
  )
    .then((dbUser) => {
      if (!dbUser)
        return res
          .status(400)
          .json({ error: 'Incorrect Username or Password' });
      return AuthService.comparePasswrods(
        loginUser.password,
        dbUser.password
      ).then((compareMatch) => {
        if (!compareMatch)
          return res
            .status(400)
            .json({ error: 'Incorrect Username or Password' });
        const sub = dbUser.username;
        const payload = {
          userId: dbUser.id,
          username: dbUser.username,
        };
        res.send({
          authToken: AuthService.createJwt(sub, payload),
          userId: dbUser.id,
          username: dbUser.username,
        });
      });
    })
    .catch(next);
});

//refreshes token
authRouter.post('/refresh', requireAuth, (req, res) => {
  const sub = req.user.username;
  const payload = {
    user_id: req.user.id,
    username: req.user.username,
  };
  res.send({ authToken: AuthService.createJwt(sub, payload) });
});

module.exports = authRouter;
