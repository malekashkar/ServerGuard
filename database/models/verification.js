const mongoose = require("mongoose");
const Verification = new mongoose.Schema({
  _id: String,
  channel: String,
  message: String,
  role: String
});

module.exports = mongoose.model("Verification", Verification);
