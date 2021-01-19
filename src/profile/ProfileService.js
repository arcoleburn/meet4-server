'use strict';

const Knex = require('knex');

const ProfileService = {
  getLocationsForUser(db, userId) {
    return db.from('locations').select('*').where('user_id', userId);
  },
  insertLocation(db, newLoc) {
    return db
      .insert(newLoc)
      .into('locations')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
  delLocation(db, id) {
    return db('locations').where({ id }).delete();
  },
  getFavoritesForUser(db, userId) {
    return db.from('favorites').select('*').where('user_id', userId);
  },
  insertFavorite(db, newFav) {
    return db
      .insert(newFav)
      .into('favorites')
      .returning('*')
      .then((rows) => rows[0]);
  },
  delFavorite(db, id) {
    return db('favorites').where({ id }).delete();
  },
  getStatsForUser(db, userId) {
    return db.from('stats').select('*').where('user_id', userId);
  },
  updateStatsForUser(db, userId, category) {
    const newStat = {};
    newStat[category] = 1;
    return db('stats').where('user_id', userId).increment(newStat);
  },
  checkForStats(db, userId) {
    return db.from('stats').select('*').where('user_id', userId);
  },
  startStats(db, stats) {
    return db
      .insert(stats)
      .into('stats')
      .returning('*')
      .then((rows) => {
        return rows[0];
      });
  },
};

module.exports = ProfileService;
