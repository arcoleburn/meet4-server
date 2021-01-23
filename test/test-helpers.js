'use strict';

const knex = require('knex');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { propfind } = require('../src/app');

/**
 * create a knex instance connected to postgres
 * @returns {knex instance}
 */
function makeKnexInstance() {
  return knex({
    client: 'pg',
    connection: process.env.TEST_DB_URL,
  });
}

/**
 * create a knex instance connected to postgres
 * @returns {array} of user objects
 */
function makeUsersArray() {
  return [
    {
      id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
      username: 'test-user-1',
      password: 'password',
      email: 'email',
    },
    {
      id: 'c9506452-3e21-49bc-84f5-1da4cc30473d',
      username: 'test-user-2',
      password: 'password',
      email: 'email',
    },
  ];
}

function seedUsers(db, users) {
  const preppedUsers = makeUsersArray().map((user) => ({
    ...user,
    password: bcrypt.hashSync(user.password, 1),
  }));
  return db.into('users').insert(preppedUsers);
}

function cleanTables(db) {
  return db.transaction(async (trx) => {
    await trx.raw('DELETE from users')
   await trx.raw('DELETE from locations')
   await trx.raw('DELETE from stats') 
   await trx.raw('DELETE from history')
  });
}

function makeLocations() {
  return [
    {
      id: 'c2b2424c-f007-4fc4-b267-8ae377acad13',
      user_id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
      location_name: 'test location',
      location_address: 'test address',
    },
  ];
}
function makeStats(){
  return [
    {
      id: 'f54094bb-0fd2-4b17-ae4e-1be8431dfc2e',
      user_id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
      pizza_count: 3,
      coffee_count: 3,
      beer_count: 3,
    }
  ]
}

function makeHistory(){
  return [
    {
      id:'c0ec9c00-e4c0-4a0d-bd22-ab527e473287',
      user1_id: '57c8529a-e7b0-416e-ab47-6cf8cd0011d8',
      user2_id: null,
      user1_location: 'loc 1',
      user2_location: 'loc 2',
      meeting_date: new Date(),
      restaurant_name: 'test restaurant',
      restaurant_address: 'test rest-address',
      category: 'Pizza'
    }
  ]
}

function seedTables(db, users, locations, stats, history) {
  return db.transaction(async (trx) => {
    await seedUsers(trx, users);
    await trx.into('locations').insert(locations);
    await trx.into('stats').insert(stats);
    await trx.into('history').insert(history)
  });
}
module.exports = {
  makeKnexInstance,
  makeUsersArray,
  seedUsers,
  cleanTables,
  seedTables,
  makeLocations,
  makeStats,
  makeHistory
};
