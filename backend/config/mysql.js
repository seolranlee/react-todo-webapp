"use strict";

const mysql = require("mysql");
const config = require("./config");

const pool = mysql.createPool(config.connect);

module.exports = pool;
