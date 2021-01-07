'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwtAuth');

const FriendsService = require('./FriendsService')

const friendsRouter = express.Router();

friendsRouter.all(requireAuth).get('/', (req, res, next) => {
  FriendsService.getFriendsForUser(
    req.app.get('db'),
    req.user.id
  ).then((friends) => res.json(friends));
}).post('/', (req, res, next) => {
  //posts a new friend request
  FriendsService.
});

friendsRouter.patch('/', (req, res, next) => {
  //updates (ie:accepts) a pending friend request
});

friendsRouter.delete('/', (req, res, next) => {
  //deletes a friend or denies friend request
});
