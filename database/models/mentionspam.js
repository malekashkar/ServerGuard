const mongoose = require("mongoose");
const Mentionspam = new mongoose.Schema({
  _id: String,
  type: String,
  amount: Number,
  time: Number,
  outcome: String,
  ping: String 
});

module.exports = mongoose.model("Mentionspam", Mentionspam);
