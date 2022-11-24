# Meet4 Server 

[Live App](https://meet4.xyz) NOTE: Due to Heroku deprecating their free tier, the live app is currently broken. 

[Client Code](https://github.com/arcoleburn/meet4-client)

## About 
Meet4 is an app that helps you meet up with your friends for pizza, coffee or beer, in any city with a subway system. 

## Endpoints 

/users
POST 
- accepts username, password, email 
- on success, encrpts password and returns serialized user object
- on failure, returns error (username taken, password error, etc)
---
/auth/login 
POST 
- accepts an object containing a username and password 
- on success, returns JWT
---
/profile/locations
GET 
- returns all of a designated users saved locations 

POST 
- accepts object of location name, location address, and user_id 
- on success, adds new location to the database, and returns location object to client

DELETE
- deletes a saved locatoin from database based on ID
---
/profile/favorites
GET
- returns all of designated user's favorites

POST
- accepts object of restauarant name, address, category, yelp url, and user id
- on success, saves user favorite in database

DELETE 
- deletes user favorites by ID 
---
/profile/stats
GET
- gets general stats for the user 

POST 
- used to initiated stats log for a new user 

PUT 
- updates stats 
---
/friends 
GET
- returns all of designated users confirmed friends 

POST
- accepts friend username, adds a new pending friendship item to the database 

PATCH 
- confirms a pending friend request by id 

PUT 
- used to update stats for an individual friendship 

DELETE 
- permanantly removes friendship from the database
---
/friends/requests
GET
- gets all pending friend requests for a user
---
/friends/friendlocs/:friendUsername
GET
- gets a friends saved locations for use in the app. Returns error if friendship does not exist, returns all friend locations if friendship confirmed.
---
/directions/results 
GET 
- accepts addressA, addressB, and restaurant category in query string. 
- uses GoogleMaps API, Node Geometry Library, and internal algorithm to find the midpoint along public transit 
- uses Yelp API to find a relevant restaurant near the midpoint 
- returns data from Yelp API to user 

/directions
GET
- returns transit directions between 2 addresses via the GoogleMaps API 

---
---

## Tech Used 

<b>Server</b>

- Node/Express
- PostgreSQL
- Knex 
- node-fetch 
- Node Geometry Library (for distance calculations)

<b>Client</b>
- React (bootstrapped with Create React App)
- React Router 
- JSON Web Token (for authorization) 
- Styled Components 
- Font Awesome (for icons)

---
<b>Meet4 is powered by the GoogleMaps API and the YelpAPI
