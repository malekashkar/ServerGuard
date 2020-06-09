const mongoose = require("mongoose");
const Config = new mongoose.Schema({
  _id: String,
  prefix: { type: String, default: "*" },
  modlogs: { type: String, default: "none" },
  autorole: Array,
  muterole: String,
  updatechannel: { type: String, default: "none" },
  logchannel: { type: String, default: "none" },
  lockbypass_roles: Array,
  lockbypass_users: Array
});

module.exports = mongoose.model("Config", Config);
