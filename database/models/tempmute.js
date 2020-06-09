const mongoose = require("mongoose");
const Tempmute = new mongoose.Schema({
  _id: String,
  time: Number,
  guild: String
});

module.exports = mongoose.model("Tempmute", Tempmute);
