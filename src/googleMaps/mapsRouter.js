'use strict';

require('dotenv').config();

const fetch = require('node-fetch');

const express = require('express');

const { PolyUtil } = require('node-geometry-library');

const { requireAuth } = require('../middleware/jwtAuth');

const MapsHelpers = require('./mapsHelpers');

const mapsRouter = express.Router();

mapsRouter
  .route('/')
  .all(requireAuth)
  .get((req, res, next) => {
    let addressA = req.query.addressA; 
    let addressB = req.query.addressB;

    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${addressA}&destination=${addressB}&mode=transit&transit_mode=subway&units=imperial&key=${process.env.GOOGLE_KEY}`
    )
      .then((res) => res.json())
      .then((data) => res.json(data));
  });

mapsRouter
  .route('/results')
  .all(requireAuth)
  .get((req, res, next) => {
    let addressA = req.query.addressA; 
    let addressB = req.query.addressB;
 
    fetch(
      `https://maps.googleapis.com/maps/api/directions/json?origin=${addressA}&destination=${addressB}&mode=transit&transit_mode=subway&key=${process.env.GOOGLE_KEY}`
    )
      .then((res) => res.json())
      .then((data) => {
        let ptsArr = PolyUtil.decode(
          data.routes[0].overview_polyline.points
        );
        let centerCoords = MapsHelpers.findMidpt(ptsArr);

        fetch(
          `https://api.yelp.com/v3/businesses/search?term=${req.query.category}&latitude=${centerCoords.lat}&longitude=${centerCoords.lng}&radius=500&price=1&sort_by=distance`,
          {
            headers: {
              authorization: `bearer ${process.env.YELP_KEY}`,
            },
          }
        )
          .then((res) => res.json())
          .then((data) => res.json(data)).catch(err=>res.json({err:err}));
      });
  });

module.exports = mapsRouter;
