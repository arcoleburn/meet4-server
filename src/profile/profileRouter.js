'use strict';

const express = require('express');

const profileRouter = express.Router()

profileRouter.get('/', (req, res, next) =>{
  //return users profile info: 
    //locations 
    //favorites 
    //stats 
})

profileRouter.get('/locations', (req, res, next) => {
  //return users saved locations. home, work, etx 

})

profileRouter.post('/locations', (req, res, next)=> {
  //add a new location to profile 
})

profileRouter.patch('/locations', (req, res, next)=>{
  //edits saved locaitons 
})

profileRouter.delete('/locations', (req, res, next) => {
  //deletes saved locations 
})

profileRouter.get('/favorites', (req, res, next)=>{
  //return users favorite restaurants 
})

profileRouter.post('/favorites', (req, res, next) => {
  //add a new favorite restaurant
})