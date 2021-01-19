'use strict';

const express = require('express');
const { requireAuth } = require('../middleware/jwtAuth');
const jsonParser = express.json();

const ProfileService = require('./ProfileService');
const profileRouter = express.Router();
profileRouter.route('/').all(requireAuth);
profileRouter.get('/', (req, res, next) => {
  //return users profile info:
  //locations
  //favorites
  //stats
  //do I actually need this?
});

profileRouter
  .route('/locations')
  .all(requireAuth)
  .get((req, res, next) => {
    ProfileService.getLocationsForUser(
      req.app.get('db'),
      req.user.id
    ).then((locs) => res.json(locs));
  })
  .post(jsonParser, (req, res, next) => {
    //add a new location to profile
    const { name, address } = req.body;
    const userId = req.user.id;
    const newLocation = {
      location_name: name,
      location_address: address,
      user_id: userId,
    };

    for (const [key, value] of Object.entries(newLocation))
      if (value == null)
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request` } });

    ProfileService.insertLocation(
      req.app.get('db'),
      newLocation
    ).then((loc) => {
      res
        .status(201)
        .location(`/api/locations/${userId}/${loc.id}`)
        .json(loc);
    });
  });

profileRouter
  .route('/locations/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    ProfileService.delLocation(
      req.app.get('db'),
      req.params.id
    ).then((x) => res.status(204).end());
  }); //patch will go here if necessary

profileRouter
  .route('/favorites')
  .all(requireAuth)
  .get((req, res, next) => {
    ProfileService.getFavoritesForUser(
      req.app.get('db'),
      req.user.id
    ).then((favs) => res.json(favs));
  })
  .post(jsonParser, (req, res, next) => {
    const {
      restaurant_name,
      restaurant_address,
      category,
      url,
    } = req.body;
    const user_id = req.user.id;

    const newFavorite = {
      restaurant_name,
      restaurant_address,
      category,
      url,
      user_id,
    };

    for (const [key, value] of Object.entries(newFavorite))
      if (value == null)
        return res
          .status(400)
          .json({ error: { message: `Missing ${key} in request` } });

    ProfileService.insertFavorite(
      req.app.get('db'),
      newFavorite
    ).then((fav) => {
      res
        .status(201)
        .location(`/api/favorites/${user_id}/${fav.id}`)
        .json(fav);
    });
  });

profileRouter
  .route('/favorites/:id')
  .all(requireAuth)
  .delete((req, res, next) => {
    ProfileService.delFavorite(
      req.app.get('db'),
      req.params.id
    ).then((x) => res.status(204).end());
  });

profileRouter
  .route('/stats')
  .all(requireAuth)
  .get((req, res, next) => {
    ProfileService.getStatsForUser(
      req.app.get('db'),
      req.user.id
    ).then((stats) => res.json(stats));
  })
  .post(jsonParser, (req, res, next) => {
    if (ProfileService.checkForStats()) {
      res.status(200).json({ message: 'stats already tracked' });
    } else {
      const newStats = {
        pizza_count: 0,
        coffee_count: 0,
        beer_count: 0,
        user_id: req.user.id,
      };

      ProfileService.startStats(
        req.app.get('db'),
        newStats
      ).then((stats) => res.json(stats));
    }
  })
  .put(jsonParser, (req, res, next) => {
    let { category } = req.body;
    console.log('body', req.body);
    category = category + '_count';
    const user_id = req.user.id;

    ProfileService.updateStatsForUser(
      req.app.get('db'),
      user_id,
      category
    ).then((stats) => res.status(201).json(stats));
  });

module.exports = profileRouter;
