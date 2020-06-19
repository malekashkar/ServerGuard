const mongoose = require("mongoose");
const Join = new mongoose.Schema({
  user: String,
  guild: String,
  time: Number
});

module.exports = mongoose.model("Join", Join);
