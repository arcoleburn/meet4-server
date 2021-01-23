'use strict';
const { expect } = require('chai');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const helpers = require('./test-helpers');
const knex = require('knex');
const supertest = require('supertest');

describe('App', () => {
  it('GET / responds with 200 containing "Hello, world!"', () => {
    return supertest(app).get('/').expect(200, 'Hello, world!');
  });
});

let token = null;

let testUser = helpers.makeUsersArray()[0];
describe('user happy path', () => {
  let db;
  before('make knex instance', () => {
    db = knex({ client: 'pg', connection: process.env.TEST_DB_URL });
    app.set('db', db);
  });
  after('disconnect db', () => db.destroy());
  before('cleanup', () => helpers.cleanTables(db));
  context('given there is data in db', () => {
    before('insert users, locations, stats', () => {
      helpers.seedTables(
        db,
        helpers.makeUsersArray(),
        helpers.makeLocations(),
        helpers.makeStats(),
        helpers.makeHistory()
      );
    });
    //login
    describe('user login', () => {
      it('responds with 200 and user auth token', () => {
        return supertest(app)
          .post('/api/auth/login')
          .send({
            username: testUser.username,
            password: testUser.password,
          })
          .expect(200)
          .then((err, res) => {
            if (err) {
              return err;
            }
            token = res.authToken;
            console.log('token in test', token);

            describe('gets user data', () => {
              it('gets locations', () => {
                return supertest(app)
                  .get('/api/profile/locations')
                  .set('Authorization', 'bearer' + token)
                  .expect(200, helpers.makeLocations()[0]);
              });
              it('posts location', () => {
                let testLoc = {
                  id: 'e41faa07-aac5-47d0-b825-6c12260a5f04',
                  user_id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
                  location_name: 'test-location',
                  location_address: 'test-address',
                };
                return supertest(app)
                  .post('/api/profile/locations')
                  .send(testLoc)
                  .set('Authorization', 'bearer' + token)
                  .expect(201, testLoc);
              });
              it('gets stats', () => {
                return supertest(app)
                  .get('/api/profile/stats')
                  .set('Authorization', 'bearer' + token)
                  .expect(200, helpers.makeStats()[0]);
              });
              it('posts stats', () => {
                return supertest(app)
                  .get('/api/profile/stats')
                  .set('Authorization', 'Bearer' + token)
                  .send({ nothing: 'nothing' })
                  .expect(200, {
                    pizza_count: 0,
                    coffee_count: 0,
                    beer_count: 0,
                    user_id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
                  });
              });
              it('updates stats', () => {
                return supertest(app)
                  .put('/api/profile/stats')
                  .set('Authorization', 'Bearer' + token)
                  .send({ category: 'pizza' })
                  .expect(201, {
                    pizza_count: 1,
                    coffee_count: 0,
                    beer_count: 0,
                    user_id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
                  });
              });
            });
            describe('friends endpts', () => {
              it('gets friends', () => {
                return supertest(app)
                  .get('/api/friends')
                  .set('Authorization', 'Bearer' + token)
                  .expect(200, {});
              });
              it('posts friend request', () => {
                return supertest(app)
                  .post('/api/friends')
                  .set('Authorization', 'Bearer' + token)
                  .send({ friendUsername: 'test-user-2' })
                  .send.expect(201, 'Request Sent');
              });
              it('gets friend requests', () => {
                return supertest(app)
                  .get('/api/friends/requests')
                  .set('Authorization', 'Bearer' + token)
                  .expect(200, {});
              });
            });

            describe('history endpts', () => {
              it('gets history', () => {
                return supertest(app)
                  .get('/api/history')
                  .set('Authorization', 'Bearer' + token)
                  .expect(200, helpers.makeHistory()[0]);
              });
              it('posts history', () => {
                return supertest(app).post(
                  '/api/history'
                    .set('Authorization', 'Bearer' + token)
                    .send(helpers.makeHistory()[0])
                    .expect(201, helpers.makeHistory()[0])
                );
              });
            });
            describe('maps', () => {
              it('gets directions', () => {
                let addressA = 'times square ny ny';
                let addressB = 'one world trade center ny ny';
                let category = 'pizza';
                return supertest(app)
                  .get(
                    `/api/directions/results?addressA=${addressA}&addressB=${addressB}&category=${category}`
                  )
                  .set('Authorization', 'bearer' + token);
              });
            });
          });
      });
    });

    //
  });
});
