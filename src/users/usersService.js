'use strict';
const bcrypt = require('bcrypjs');

const UsersService = {
  hasUserWithUsername(db, username) {
    return db('users')
      .where({ username })
      .first()
      .then((user) => !!user);
  },
  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('users')
      .returning('*')
      .then(([user]) => user);
  },
  serializeUser(user) {
    return {
      id: user.id,
      username: user.username,
      email: user.email,
    };
  },
  hashPassword(password) {
    return bcrypt.hash(password, 12);
  },
};
module.exports = UsersService;
