'use strict';

const favoritesService = {
  getFavoritesForUser(db, userId) {
    return db.from('favorites').select('*').where('user_id', userId);
  },
  addFavorite(db, favorite) {
    return db
      .insert(favorite)
      .into('favorites')
      .returning('*')
      .then((rows) => rows[0]);
  },
  deleteFavorite(db, id) {
    return db('favorites').where({ id }).delete();
  },
};

module.exports = favoritesService;
