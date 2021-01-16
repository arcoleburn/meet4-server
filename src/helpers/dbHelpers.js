'use strict';

const DbHelpers = {
  getUserIdFromUsername(db, username) {
    if (username === null) {
      return null;
    }
    return db('users').select('id').where({ username });
  },
  getUsernameFromId(db, id) {
    return db('users').select('username').where({ id });
  },
};

module.exports = DbHelpers;
