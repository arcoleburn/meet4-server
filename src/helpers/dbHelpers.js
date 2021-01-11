'use strict';

const DbHelpers = {
  getUserIdFromUsername(db, username) {
    return db('users').select('id').where({ username });
  },
  getUsernameFromId(db, id) {
    return db('users').select('username').where({ id });
  },
};

module.exports = DbHelpers;
