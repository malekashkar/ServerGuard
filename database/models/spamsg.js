const mongoose = require("mongoose");

const Spamsg = new mongoose.Schema({
  user: String,
  amount: Number,
  lastmsg: String,
  time: {type: Number, default: Date.now()}
});

module.exports = mongoose.model("Spamsg", Spamsg);
