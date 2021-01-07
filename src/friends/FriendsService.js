'use strict'

const FriendsService ={

  getFriendsForUser(db, userId){
    return db.from('friends').whereNot({accepted: false})
  },

  getFriendRequestsForUser(){},

  sendFriendRequest(){},

  deleteFriend(){}



}