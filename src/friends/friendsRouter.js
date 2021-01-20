'use strict';

const express = require('express');
const DbHelpers = require('../helpers/dbHelpers');
const { requireAuth } = require('../middleware/jwtAuth');
const UsersService = require('../users/usersService');
const jsonParser = express.json();
const FriendsService = require('./FriendsService');

const friendsRouter = express.Router();

friendsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    console.log('req user', req.user)
    FriendsService.getFriendsForUser(
      req.app.get('db'),
      req.user.id
    ).then((friends) => res.json(friends));
  })
  .post(jsonParser, (req, res, next) => {
    //posts a new friend request
    let { friendUsername } = req.body;
    let username = friendUsername;
    UsersService.hasUserWithUsername(
      req.app.get('db'),
      username
    ).then((userExists) => {
      if (!userExists) {
        res.status(400).json({ error: 'user does not exist' });
        return;
      }
    });
    FriendsService.sendFriendRequest(
      req.app.get('db'),
      req.user.id,
      username
    ).then((rship) => {
      res
        .status(201)
        .location(`/api/friends/${rship.id}`)
        .json('Request Sent');
    });
  });

friendsRouter
  .all(requireAuth)
  .route('/:id')
  .patch(jsonParser, (req, res, next) => {
    let id = req.params.id;
    FriendsService.acceptRequest(req.app.get('db'), id).then((x) =>
      res.json(x)
    );
  })
  .put(jsonParser, (req, res, next) => {
    let id = req.params.id;
    let { category } = req.body;
    category = category + '_count';
    FriendsService.updateFriendStats(
      req.app.get('db'),
      id,
      category
    ).then((stats) => res.status(201).json(stats));
  })
  .delete((req, res, next) => {
    //deletes a friend or denies friend request
    FriendsService.deleteFriend(
      req.app.get('db'),
      req.params.id
    ).then((x) => res.status(204).end());
  });
friendsRouter
  .route('/requests')
  .all(requireAuth)
  .get((req, res, next) => {
    FriendsService.getFriendRequestsForUser(
      req.app.get('db'),
      req.user.id
    ).then((requests) => res.json(requests));
  });

friendsRouter
  .route('/friendlocs/:friendUsername')
  .all(requireAuth)
  .get((req, res, next) => {
    const friendId = DbHelpers.getUserIdFromUsername(
      req.app.get('db'),
      req.params.friendUsername
    );
    if (
      !FriendsService.friendshipExists(
        req.app.get('db'),
        req.user.id,
        friendId
      )
    ) {
      return res.status(400).json({
        error: 'Friendship does not exist, or has not been confirmed',
      });
    }
    if (
      FriendsService.friendshipExists(
        req.app.get('db'),
        req.user.id,
        friendId
      )
    ) {
      FriendsService.getFriendLocs(
        req.app.get('db'),
        friendId
      ).then((info) => res.json(info));
    }
  });

module.exports = friendsRouter;
