'use strict';

const express = require('express');

const friendsRouter = express.Router();

friendsRouter.get('/', (req, res, next) => {
  //returns all of a users friends
});

friendsRouter.post('/', (req, res, next) => {
  //posts a new friend request
});

friendsRouter.patch('/', (req, res, next)=>{
  //updates (ie:accepts) a pending friend request 
})

friendsRouter.delete('/', (req, res, next)=>{
  //deletes a friend or denies friend request 
}
)