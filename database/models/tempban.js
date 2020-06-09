const mongoose = require("mongoose");
const Tempban = new mongoose.Schema({
  _id: String,
  time: Number,
  guild: String
});

module.exports = mongoose.model("Tempban", Tempban);
