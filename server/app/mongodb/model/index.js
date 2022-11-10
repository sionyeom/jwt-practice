const dbConfig = require("../config/config.js");
const mongoose = require("mongoose");

// Use Node.js native promise
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = dbConfig.url;
db.tutorial = require("./model.js")(mongoose);
db.user = require("./user.js")(mongoose);

module.exports = db;
