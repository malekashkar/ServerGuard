const mongoose = require("mongoose");
const Spam = new mongoose.Schema({
  user: String,
  amount: Number,
  time: {type: Number, default: Date.now()}
});

module.exports = mongoose.model("Spam", Spam);
