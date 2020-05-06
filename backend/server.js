const express = require("express");
const app = express();
const cors = require("cors");
const config = require("./config/config");
const bodyParser = require("body-parser");

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

const router = require("./router")(app);
const sequelize = require("./models").sequelize;

sequelize.sync();
app.listen(config.port);
