const mongoose = require("mongoose");
const Premium = new mongoose.Schema({
  _id: String
});

module.exports = mongoose.model("Premium", Premium);
