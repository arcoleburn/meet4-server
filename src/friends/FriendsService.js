'use strict';

const { getUserIdFromUsername } = require('../helpers/dbHelpers');

const FriendsService = {
  getFriendsForUser(db, userId) {
    return db
      .from('friends')
      .select(
        'friends.id',
        'username',
        'email',
        'date_added',
        'pizza_count',
        'coffee_count',
        'beer_count'
      )
      .where('initiator_id', userId)
      .orWhere('recipient_id', userId)
      .whereNot({ accepted: false })
      .join('users', function () {
        this.on('initiator_id', '=', 'users.id').orOn(
          'recipient_id',
          '=',
          'users.id'
        );
      });
  },

  getFriendRequestsForUser(db, userId) {
    return db('friends')
      .select('friends.id', 'username')
      .where('recipient_id', userId)
      .where({ accepted: false })
      .join('users', 'initiator_id', '=', 'users.id');
  },

  sendFriendRequest(db, userId, username) {
    return getUserIdFromUsername(db, username).then((x) => {
     
      let newFriendship = {
        initiator_id: userId,
        recipient_id: x[0].id,
        accepted: false,
      };

      return db
        .insert(newFriendship)
        .into('friends')
        .returning('id')
        .then((rows) => {
          return rows[0];
        });
    });
  },
  acceptRequest(db, id) {
    return db('friends')
      .where({ id })
      .update({ accepted: true })
      .returning('*')
      .then((rows) => rows[0]);
  },

  deleteFriend(db, id) {
    return db('friends').where({ id }).delete();
  },
  friendshipExists(db, id1, id2) {
    return db('friends')
      .where(function () {
        this.where('initiator_id', id1).orWhere('recipient_id', id1);
      })
      .where(function () {
        this.where('iniator_id', id2).orWhere('recipient_id', id2);
      })
      .where('accepted', true);
  },
  getFriendInfo(db, id) {
    return db.from('users').where({ id }).select('username', 'email');
  },
  getFriendLocs(db, id) {
    return db.from('locations').where('user_id', id).select('*');
  },
};

module.exports = FriendsService;
