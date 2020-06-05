const mongoose = require("mongoose");
const Config = new mongoose.Schema({
  _id: String,
  prefix: String
});

module.exports = mongoose.model("Config", Config);
