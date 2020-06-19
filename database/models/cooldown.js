const mongoose = require("mongoose");
const Cooldown = new mongoose.Schema({
  user: String,
  time: Number,
  command: String
});

module.exports = mongoose.model("Cooldown", Cooldown);
