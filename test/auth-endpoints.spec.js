'use strict';

const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Auth Endpoints', function () {
  let db;

  const testUsers = helpers.makeUsersArray();
  const testUser = testUsers[0];

  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());

  before('cleanup', () => helpers.cleanTables(db));

  afterEach('cleanup', () => helpers.cleanTables(db));

  /**
   * @description Get token for login
   **/
  describe(`POST /api/auth/token`, () => {
    before('insert users', () =>
      helpers.seedUsers(db, testUsers)
    );
    const requiredFields = ['username', 'password'];
    requiredFields.forEach((field) => {
      const loginAttemptBody = {
        username: testUser.username,
        password: testUser.password,
      };

      it(`responds with 400 required error when ${field} is missing`, () => {
        delete loginAttemptBody[field];
        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, { error: `Missing ${field} in request body` });
      });
    });
    it(`responds 400 'invalid username or password' when bad username`, () => {
      const userInvalid = {
        username: 'user-not',
        password: 'exists',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalid)
        .expect(400, { error: 'Incorrect Username or Password' });
    });
    it(`responds 400 'invalid username or password' when bad password`, () => {
      const userInvalidPassword = {
        username: testUser.username,
        password: 'incorrect',
      };
      return supertest(app)
        .post('/api/auth/login')
        .send(userInvalidPassword)
        .expect(400, { error: 'Incorrect Username or Password' });
    });
  });
});
