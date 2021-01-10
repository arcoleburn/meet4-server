'use strict';

const HistoryService = {
  getHistoryForUser(db, id) {
    return db
      .from('history')
      .select('*')
      .where('user1_id', id)
      .orWhere('user2_id', id);
  },
  addHistory(db, history) {
    return db
      .insert(history)
      .into('history')
      .returning('*')
      .then((rows) => rows[0]);
  },
};

module.exports = HistoryService;
