'use strict';

const DbHelpers = {
  getUserIdFromUsername(db, username) {
    return db.from('users').select('id').where({ username });
  },
  getUsernameFromId(db, id) {
    return db.from('users').select('username').where({ id });
  },
};

module.exports = DbHelpers;
