"use strict";

class Model {
  constructor() {
    this._database = require("../config/mysql");
  }

  execute(sql, obj, callback) {
    this._database.getConnection((err, connection) => {
      if (err) throw err;

      connection.query(sql, obj, (err, rows) => {
        connection.release();
        callback(err, rows);
      });
    });
  }
}

module.exports = new Model();
