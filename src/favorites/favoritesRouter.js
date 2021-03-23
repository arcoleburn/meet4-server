'use strict';

const express = require('express');
const DbHelpers = require('../helpers/dbHelpers');

const { requireAuth } = require('../middleware/jwtAuth');
const favoritesService = require('./favoritesService');
const jsonParser = express.json();

const favoritesRouter = express.Router();

favoritesRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    favoritesService
      .getFavoritesForUser(req.app.get('db'), req.user.id)
      .then((favorites) => res.json(favorites));
  })
  .post(jsonParser, (req, res, next) => {
    console.log('req body for fav', req.body)
    let {
      restaurant_name,
      restaurant_address,
      restaurant_phone,
      category,
      yelp_id,
      url,
      img_url,
    } = req.body;

    const newFav = {
      user_id: req.user.id,
      restaurant_name,
      restaurant_address,
      restaurant_phone,
      category,
      yelp_id,
      url,
      img_url,
    };
    favoritesService
      .addFavorite(req.app.get('db'), newFav)
      .then((fav) =>
        res.status(201).location(`/api/favorites/${fav.id}`).json(fav)
      );
  });
favoritesRouter
  .all(requireAuth)
  .route('/:id')
  .delete((req, res, next) => {
    favoritesService
      .deleteFavorite(req.app.get('db'), req.params.id)
      .then((x) => res.status(204).end());
  });

module.exports = favoritesRouter;
