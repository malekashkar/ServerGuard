const mongoose = require("mongoose");
const Config = new mongoose.Schema({
  _id: String,
  owner: String,
  prefix: { type: String, default: "*" },
  modlogs: { type: String, default: "none" },
  dmlogs: { type: Boolean, default: false },
  logchannel: { type: String, default: "none" },
  adminrole: Array,
  autorole: Array,
  muterole: String,
  lockbypass_roles: Array,
  lockbypass_users: Array,
  premium: { type: Boolean, default: false },
  verification: {
    channel: String,
    message: String,
    unverified: String,
    verified: String
  },
  mentionspam: {
    type: String,
    amount: Number,
    time: Number,
    outcome: String,
    ping: Array 
  },
  textspam: {
    amount: Number,
    time: Number,
    outcome: String,
    ping: Array
  }
});

module.exports = mongoose.model("Config", Config);
