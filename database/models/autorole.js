const mongoose = require("mongoose");
const Autorole = new mongoose.Schema({
  _id: String,
  roles: Array
});

module.exports = mongoose.model("Autorole", Autorole);
