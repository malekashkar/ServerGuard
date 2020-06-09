const mongoose = require("mongoose");
const Textspam = new mongoose.Schema({
  _id: String,
  amount: Number,
  time: Number,
  outcome: String,
  ping: String 
});

module.exports = mongoose.model("Textspam", Textspam);
