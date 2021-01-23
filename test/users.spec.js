'use strict';

const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');

describe('Users endpts', function () {
  let db;
  const testUser = {
    username: 'userface',
    password: 'password123',
    email: 'email',
  };
  before('make knex instance', () => {
    db = helpers.makeKnexInstance();
    app.set('db', db);
  });

  after('disconnect from db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  afterEach('cleanup', () => helpers.cleanTables(db));
  describe('POST /api/users', () => {
    it('responds 201 with serialized user', () => {
      return supertest(app)
        .post('/api/users')
        .send(testUser)
        .expect((res) => {
          expect(res.body).to.have.property('id');
          expect(res.body.username).to.eql(testUser.username);
          expect(res.body.email).to.eql(testUser.email);
          expect(res.body).to.not.have.property('password');
        })
        .expect((res) =>
          db
            .from('users')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then((row) => {
              expect(row.username).to.eql(testUser.username);
            })
        );
    });
  });
});
