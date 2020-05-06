const path = require("path");
const Sequelize = require("sequelize");

const env = process.env.NODE_ENV || "development";
const config = require(path.join(
  __dirname,
  "..",
  "config",
  "sequelizeConfig.json"
))[env];
const db = {};

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  config
);

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.Todo = require("./todo")(sequelize, Sequelize);
db.Todos_relationship = require("./todos_relationship")(sequelize, Sequelize);
db.Todos_relationship.removeAttribute("id");

module.exports = db;
