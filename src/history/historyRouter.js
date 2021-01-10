'use strict';

const express = require('express');

const { requireAuth } = require('../middleware/jwtAuth');
const HistoryService = require('./HistoryService');
const jsonParser = express.json();

const historyRouter = express.Router();

historyRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    HistoryService.getHistoryForUser(
      req.app.get('db'),
      req.user.id
    ).then((history) => res.json(history));
  })
  .post(jsonParser, (req, res, next) => {
    let {
      user1_id,
      user2_id,
      user1_location,
      user2_location,
      restaurant_name,
      restaurant_address,
      category,
    } = req.body;

    const newHistory = {
      user1_id,
      user2_id,
      user1_location,
      user2_location,
      restaurant_name,
      restaurant_address,
      category,
    };

    HistoryService.addHistory(
      req.app.get('db'),
      newHistory
    ).then((hist) =>
      res.status(201).location(`/api/history/${hist.id}`).json(hist)
    );
  });

module.exports = historyRouter;
